// 
//  定义Hash类型
//  JPlus -> hash.js
//  
//  Created by nowa on 2008-06-19.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, {
	
	/**
	 * 构造函数，将初始Object赋给this._object
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method initialize
	 * @param {Object} object
	 */
	initialize: function(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  },

	/**
	 * for Enumerable.each，Hash自有的each实现
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method _each
	 * @param {Function:iterator} iterator
	 */
	_each: function(iterator) {
		for (var key in this._object) {
			var value = this._object[key], pair = [key, value];
			pair.key = key;
			pair.value = value;
			iterator(pair);
		}
	},
	
	/**
	 * 设置指定key的value
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method set
	 * @param {Object:key} key
	 * @param {Object:value} value
	 * @return {Object} value
	 */
	set: function(key, value) { 
    return this._object[key] = value;
  },

	/**
	 * 返回指定key的value
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method get
	 * @param {Object:key} key
	 * @return {Object} value
	 */
	get: function(key) {
		return this._object[key];
	},
	
	/**
	 * 删除指定的key以及其value
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method remove
	 * @param {Object:key} key
	 * @return {Object} value
	 */
	remove: function(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  },

	/**
	 * 返回一个数组，其中包括了Hash所有的key
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method keys
	 * @return {Array} hash key array
	 */
	keys: function() {
    return this.pluck('key');
  },

	/**
	 * 返回一个数组，其中包括了Hash所有的value
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method values
	 * @return {Array} hash value array
	 */
  values: function() {
    return this.pluck('value');
  },

	/**
	 * 返回指定value的key，只返回第一个匹配
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method index
	 * @param {Object:value} value
	 * @return {Object} key of the value
	 */
	index: function(value) {
    var match = this.detect(function(pair) { 
      return pair.value === value; 
    });
    return match && match.key;
  },

	/**
	 * 将自身与指定的Object merge后返回一个新的Hash对象
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method merge
	 * @param {Object:object} object
	 * @return {Hash} merge后的hash
	 */
	merge: function(object) {
    return this.clone().update(object);
  },

	/**
	 * 将自身与指定的object merge，不返回新的Hash对象
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method update
	 * @param {Object:object} object
	 * @return {Hash} update后的hash
	 */
  update: function(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  },

	/**
	 * 输出Hash以便查看
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method inspect
	 * @return {String} ruby like hash object string
	 */
	inspect: function() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  },
	
	/**
	 * 转化为Javascript内置的Object对象
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method toObject
	 * @return {Object} object
	 */
	toObject: function() {
    return Object.clone(this._object);
  },

	/**
	 * 转换为JSON字串
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method toJSON
	 * @return {String} JSON string
	 */
	toJSON: function() {
    return Object.toJSON(this.toObject());
  },

	/**
	 * 克隆自身
	 *
	 * @author from Prototype1.6
	 * @class Hash
	 * @method clone
	 * @return {Hash} a clone of the hash
	 */
	clone: function() {
    return new Hash(this);
  }
	
});