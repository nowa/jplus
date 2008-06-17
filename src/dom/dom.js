/**
 * DOM相关
 */ 

/**
 * 根据id获取html element
 *
 * @author from Prototype1.6
 * @method $
 * @param {Object} 参数可以是Array也可以是String
 * @return {Array or Element} 如果参数是Array，那么返回值也是一个element数组；如果参数是String，返回值是element object
 */
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

// element constructor
(function() {
	var element = this.Element;
	this.Element = function(tagName, attributes) {
		attributes = attributes || {};
		tagName = tagName.toLowerCase();
		var _element = Element.extend(document.createElement(tagName));
		for (var attr in attributes) {
			_element.setAttribute(attr, attributes[attr]);
		}
		return _element;
	}
	Object.extend(this.Element, element || {});
	if (element) this.Element.prototype = element.prototype;
}).call(window);

Element.Methods = {
	/*
	 * 元素可见状态
	 * 
	 * @author from Prototype1.6
	 * @class Element.Methods
	 * @method visible
	 * @param {HTMLElement} html元素
	 * @return {BOOLEAN} 布尔值
	 */
	visible : function(element) {
		return $(element).style.display != 'none';
	},
	
	/*
	 * 显示元素
	 * 
	 * @author from Prototype1.6
	 * @class Element.Methods
	 * @method show
	 * @param {HTMLElement} html元素
	 * @param {String:d} block or inline or others
	 * @return {HTMLElement} html元素
	 */
	show : function(element, d) {
		$(element).style.display = d ? d : '';
    return element;
	}
};

// Element的方法
(function() {
	/*
	 * 将给定object的方法methodize
	 * 
	 * @author nowa
	 * @class Element
	 * @method methodizeMethods
	 * @param {Object} object
	 * @return {Object} object
	 */
	this.methodizeMethods = function(methods) {
		var property, value, methods = methods || this.Methods, _Methods = {};
		for (property in methods) {
			value = methods[property];
			if (Object.isFunction(value) && !(property in _Methods))
				_Methods[property] = value.methodize();
		}
		return _Methods;
	};
	
	/*
	 * 将Methods添加到element实例，仅针对不支持element.__proto__特性的浏览器
	 *
	 * @author based on Prototype1.6
	 * @class Element
	 * @method extend
	 * @param {HTMLElement} html元素
	 * @return {HTMLElement} html元素
	 */
	this.extend = (function() {
		if (JPlus.BrowserFeatures.SpecificElementExtensions)
			return JPlus.K;

		var extend = Object.extend(function(element) {
			if (!element || element._extendedByPrototype || 
	        element.nodeType != 1 || element == window) return element;

			Object.extend(element, Element.methodizeMethods());

			element._extendedByPrototype = JPlus.emptyFunction;
	    return element;
		}, {});

		return extend;
	})();
}).call(Element);

Object.extend(Element, Element.Methods);

// 判断浏览器是否是支持element.__proto__而不支持window.HTMLElement，如果是，则构造一个window.HTMLElement作为element.__proto__的原型父链
if (!JPlus.BrowserFeatures.ElementExtensions && 
    document.createElement('div')['__proto__']) {
  window.HTMLElement = { };
  window.HTMLElement.prototype = document.createElement('div')['__proto__'];
  JPlus.BrowserFeatures.ElementExtensions = true;
}

// 将Methods添加到window.HTMLElement，它是html element的constructor
if (JPlus.BrowserFeatures.ElementExtensions)
	Object.extend(window.HTMLElement.prototype, Element.methodizeMethods());