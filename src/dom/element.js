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
function $(element, notrash) {
  if ($type(element) == 'array') {
    for (var i = 0, elements = [], length = element.length; i < length; i++)
      elements.push($(element[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
	element.uid = element.uid || [Element.UID++];
  return (!notrash) ? Element.extend(element) : element;
}

function $i(id) {
	return document.getElementById(id);
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

Element.UID = 0;

Element.Storage = {

	get: function(uid){
		return (this[uid] = this[uid] || {});
	}

};

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
	},
	
	set: function(element, prop, value){
		element = $(element);
		switch ($type(prop)){
			case 'object':
				for (var p in prop) element.set(p, prop[p]);
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				(property && property.set) ? property.set.apply(element, $A(arguments).slice(1)) : element.setProperty(prop, value);
		}
		return element;
	},
	
	get: function(element, prop) {
		element = $(element);
		var property = Element.Properties.get(prop);
		return (property && property.get) ? property.get.apply(element, $A(arguments).slice(1)) : element.getProperty(prop);
	},
	
	erase: function(element, prop){
		element = $(element);
		var property = Element.Properties.get(prop);
		(property && property.erase) ? property.erase.apply(element, $A(arguments).slice(1)) : element.removeProperty(prop);
		return element;
	},
	
	setProperty: function(element, attribute, value){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute], hasValue = value ? value : !!value;
		if (key && EA.Bools[attribute]) value = (value || !hasValue) ? true : false;
		else if (!hasValue) return element.removeProperty(attribute);
		(key) ? element[key] = value : element.setAttribute(attribute, value);
		return element;
	},
	
	getProperty: function(element, attribute){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute];
		var value = (key) ? element[key] : element.getAttribute(attribute);
		return (EA.Bools[attribute]) ? !!value : value;
	},
	
	removeProperty: function(element, attribute){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute], isBool = (key && EA.Bools[attribute]);
		(key) ? element[key] = (isBool) ? false : '' : element.removeAttribute(attribute);
		return element;
	},
	
	getElements: function(element, tags) {
		if (Object.isString(tags)) tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag) {
			partial = this.getElementsByTagName(tag.trim());
			elements = (ddup) ? elements.concat($A(partial)) : $A(partial);
		}, $(element));
		
		return elements.unique().map(function(el) {
			return $(el);
		});
	},
	
	toQueryString: function(element) {
		return $(element).getElements('input, select, textarea').inject([], function(results, el) {
			var name = el.name, type = el.type, value = el.get('value');
			if (value === false || !name || el.disabled) return;
			$splat(value).each(function(val) {
				results.push(name + '=' + encodeURIComponent(val));
			});
			return results;
		}).join('&');
	},
	
	retrieve: function(element, property, dflt){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		var prop = storage[property];
		if ($defined(dflt) && !$defined(prop)) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(element, property, value){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		storage[property] = value;
		return element;
	},

	eliminate: function(element, property){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		delete storage[property];
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
			
		var Methods = { };

		var extend = Object.extend(function(element) {
			if (!element || element._extendedByPrototype || 
	        element.nodeType != 1 || element == window) return element;

			Object.extend(element, Element.methodizeMethods(Methods));

			element._extendedByPrototype = JPlus.emptyFunction;
	    return element;
		}, {
			refresh: function() {
	      // extend methods for all tags (Safari doesn't need this)
	      if (!JPlus.BrowserFeatures.ElementExtensions) {
	        Object.extend(Methods, Element.Methods);
	      }
	    }
		});

		extend.refresh();
		return extend;
	})();
	
	/*
	 * 给Element添加方法
	 *
	 * @author based on Prototype1.6
	 * @class Element
	 * @method addMethods
	 * @param {Object:methods} methods hash
	 */
	this.addMethods = function(methods) {
	  Object.extend(Element.Methods, methods || { });

	  if (JPlus.BrowserFeatures.ElementExtensions) {
			Object.extend(HTMLElement.prototype, this.methodizeMethods(Element.Methods));
	  }

	  Object.extend(Element, Element.Methods);

	  if (Element.extend.refresh) Element.extend.refresh();
	};
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

Element.Properties = new Hash({
	style: {
		set: function(style){
			this.style.cssText = style;
		},

		get: function(){
			return this.style.cssText;
		},

		erase: function(){
			this.style.cssText = '';
		}
	},
	
	value: {
		get: function() {
			switch (this.get('tag')){
				case 'select':
					var values = [];
					$A(this.options).each(function(option){
						if (option.selected) values.push(option.value);
					});
					return (this.multiple) ? values : values[0];
				case 'input': if (['checkbox', 'radio'].include(this.type) && !this.checked) return false;
				default: return $pick(this.value, false);
			}
		}
	},
	
	tag: {
		get: function(){
			return this.tagName.toLowerCase();
		}
	},
	
	html: {
		set: function(){
			return this.innerHTML = $A(arguments).flatten().join('');
		}
	}
});

Element.Attributes = {
	Props: {'html': 'innerHTML', 'class': 'className', 'for': 'htmlFor', 'text': (JPlus.Browser.IE) ? 'innerText' : 'textContent'},
	Bools: ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'],
	Camels: ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap']
};

(function(EA){

	var EAB = EA.Bools, EAC = EA.Camels;
	EA.Bools = EAB = EAB.associate(EAB);
	EA.Props = $H(EA.Props).merge(EAB).update(EAC.associate(EAC.map(function(v){
		return v.toLowerCase();
	}))).toObject();
	delete EA.Camels;

})(Element.Attributes);