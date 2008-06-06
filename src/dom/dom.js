/**
 * DOM相关
 */ 

/**
 * 根据id获取html element
 *
 * @author from Prototype1.6
 * @method $
 * @param {object} 参数可以是Array也可以是String
 * @return {object} 如果参数是Array，那么返回值也是一个element数组；如果参数是String，返回值是element object
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
var Element = window.Element || {};

Element.Methods = {
	/*
	 * 元素可见状态
	 * 
	 * @author from Prototype1.6
	 * @method Element.visible
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
	 * @method Element.show
	 * @param {HTMLElement} html元素
	 * @return {HTMLElement} html元素
	 */
	show : function(element) {
		$(element).style.display = 'block';
    return element;
	}
};

// Element的方法
(function() {
	/*
	 * 将给定object的方法methodize
	 * 
	 * @author nowa
	 * @method Element.methodizeMethods
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
}).call(Element);

Object.extend(Element, Element.Methods);

/*
 * 将Methods添加到element实例，仅针对不支持element.__proto__特性的浏览器
 *
 * @author based on Prototype1.6
 * @method Element.extend
 * @param {HTMLElement} html元素
 * @return {HTMLElement} html元素
 */
Element.extend = (function() {
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