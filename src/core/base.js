// 
//  基础方法及类库
//  JPlus -> base.js
//  
//  Created by nowa on 2008-06-11.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

var Class = {
	create : function() {
		var parent = null, properties = $A(arguments);
		if (Object.isFunction(properties[0])) parent = properties.shift();
		
		function klass () {
			this.initialize.apply(this, arguments);
		}
		
		Object.extend(klass, Class.Methods);
		klass.superclass = parent;
		klass.subclasses = [];
		
		if (parent) {
			var subclass = function() {};
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass;		// 仅仅需要从parent继承原型对象，parent构造函数里定义的实例属性 并不需要，所以使用了subclass
			parent.subclasses.push(klass);
		}
		
		for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

		if (!klass.prototype.initialize)
      klass.prototype.initialize = JPlus.emptyFunction;

		klass.prototype.constructor = klass;
		return klass;
	}
};

Class.Methods = {
	addMethods: function(source) {
		var ancestor   = this.superclass && this.superclass.prototype;		// 如果是一个继承
    var properties = Object.keys(source);

		if (!Object.keys({ toString: true }).length)
      properties.push("toString", "valueOf");

		for (var i = 0, length = properties.length; i < length; i++) {
			var property = properties[i], value = source[property];
			// 支持$super父类同名方法调用
			if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value, value = Object.extend((function(m) { 
          return function() { return ancestor[m].apply(this, arguments) };
        })(property).wrap(method), {
          valueOf:  function() { return method },
          toString: function() { return method.toString() }  
        });
      }
      this.prototype[property] = value;
		}
		
		return this;
	}
};

/**
 * 为Object对象添加继承方法
 *
 * @author from Prototype1.6
 * @class Object
 * @method extend
 * @param {Object} object
 * @return {Object} object
 */
Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

// 向Object添加自定义方法
Object.extend(Object, {
	
	/**
	 * 返回一个数组，其中包含了一个对象中的全部现有的主键
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method keys
	 * @param {Object} object
	 * @return {Array} property key array
	 */
	keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

	/**
	 * 返回一个数组，其中包含了一个对象中的全部现有的主键的值
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method values
	 * @param {Object} object
	 * @return {Array} property value array
	 */
	values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },
	
	/**
	 * 输出对象以便查看
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method inspect
	 * @param {Object} object
	 * @return {Bool} String
	 */
	inspect: function(object) {
    try {
      if (Object.isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

	/**
	 * 通用的对未知类型对象的toJSON方法
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method toJSON
	 * @param {Object} object
	 * @return {String} json string
	 */
	toJSON: function(object) {
		var type = typeof object;
		switch (type) {
			case "unknown": return;
			case "boolean": return object.toString();
		}
		
		if (object == null) return 'null';
		if (Object.isElement(object)) return;
		if (Object.isFunction(object.toJSON)) return object.toJSON();
		
		var results = [];
		for (var property in object) {
			var value = Object.toJSON(object[property]);
			if (!Object.isUndefined(value)) results.push(property.toJSON() + ': ' + value);
		}
		
		return '{' + results.join(', ') + '}';
	},
	
	clone: function(object) {
    return Object.extend({ }, object);
  },

	/**
	 * 检查对象是否是String
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method isString
	 * @param {Object} object
	 * @return {Bool} true or false
	 */
	isString: function(object) {
	  return typeof object == "string";
	},
	
	isArray: function(object) {
    return object != null && typeof object == "object" &&
      'splice' in object && 'join' in object;
  },
	
	isNumber: function(object) {
    return typeof object == "number";
  },
	
	isHash: function(object) {
    return object instanceof Hash;
  },
	
	/**
	 * 检查对象是否是Function
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method isFunction
	 * @param {Object} object
	 * @return {Bool} true or false
	 */
	isFunction: function(object) {
    return typeof object == "function";
  },

	/**
	 * 检查对象是否是Element
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method isElement
	 * @param {Object} object
	 * @return {Bool} true or false
	 */
	isElement: function(object) {
    return object && object.nodeType == 1;
  },

	/**
	 * 检查对象是否是Undefined
	 *
	 * @author from Prototype1.6
	 * @class Object
	 * @method isUndefined
	 * @param {Object} object
	 * @return {Bool} true or false
	 */
	isUndefined: function(object) {
    return typeof object == "undefined";
  }
	
});

Object.extend(Function.prototype, {
	
	/**
	 * 返回参数的数组列表
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method argumentNames
	 * @return {Array} arguments array
	 */
	argumentNames: function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  },

	/**
	 * bind不会让this指针被劫持，它用于绑定上下文（this）
	 * 或者也可以说让一个没有m方法的b对象具备m方法： a.m.bind(b)
	 * 和call、apply有相同之处，但是可以传递两次参数
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method bind
	 * @return {Function} function
	 */
	bind: function() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = $A(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat($A(arguments)));
    }
  },

	bindAsEventListener: function() {
    var __method = this, args = $A(arguments), object = args.shift();
    return function(event) {
      return __method.apply(object, [event || window.event].concat(args));
    }
  },

	delay: function() {
		var __method = this, args = $A(arguments), timeout = args.shift() * 1000;
		return window.setTimeout(function() {
			return __method.apply(__method, args);
			}, timeout);
  },

	/**
	 * 使用指定的function作为wrapper来包装自身
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method wrap
	 * @return {Function} function
	 */
	wrap: function(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, [__method.bind(this)].concat($A(arguments))); 		// 之所以要bind是为了将this传递到wrapper里去，否则是不具备对当前对象的引用的
    }
  },
	
	/**
	 * 将方法methodize，对象作为第一个参数传递
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method methodizes
	 * @return {Function} methodize后的方法
	 */
	methodize: function() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      return __method.apply(null, [this].concat($A(arguments)));
    };
  }

});