// 
//  基础方法及类库
//  JPlus -> base.js
//  
//  Created by nowa on 2008-06-11.
//  Copyright 2008 jplus.welost.us. All rights reserved.
// 

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