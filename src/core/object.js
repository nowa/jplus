// 
//  对Object的扩展
//  JPlus -> object.js
//  
//  Created by nowa on 2008-06-11.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
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
	
	toQueryString: function(object) {
    return $H(object).toQueryString();
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

	isDate: function(object) {
    return object != null && typeof object == "object" &&
      'getFullYear' in object && 'toGMTString' in object;
  },

	isRegExp: function(object) {
    return object != null && typeof object == "object" &&
      'test' in object && 'exec' in object;
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