// 
//  对Array的扩展，以及相关方法
//  JPlus -> array.js
//  
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

/**
 * 将可以枚举的对象转化为Array
 *
 * @author from Prototype1.6
 * @method $A
 * @param {Object} 可枚举的对象
 * @return {Array} array
 */
function $A(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

// 针对webkit做特别处理
if (JPlus.Browser.WebKit) {
  $A = function(iterable) {
    if (!iterable) return [];
    if (!(Object.isFunction(iterable) && iterable == '[object NodeList]') &&
        iterable.toArray) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  };
}

// 将Enumerable的方法扩展给Array
Object.extend(Array.prototype, Enumerable);

// Array的独有扩展方法
Object.extend(Array.prototype, {
	
	// for Enumerable.each，每个iterable对象的迭代方式不一样
	// from Prototype1.6
	_each: function(iterator) {
		for (var i=0, length=this.length; i < length; i++) {
			iterator(this[i]);
		}
	},
	
	/**
	 * 清除所以数组项
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method clear
	 * @return {Array} empty array
	 */
	clear: function() {
		this.length = 0;
		return this;
	},
	
	/**
	 * 返回第一个数组项
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method first
	 * @return {Object} 第一个数组项
	 */
	first: function() {
		return this[0];
	},
	
	/**
	 * 返回最后一个数组项
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method last
	 * @return {Object} 最后一个数组项
	 */
	last: function() {
		return this[this.length - 1];
	},
	
	/**
	 * 从数组里删除指定项，可以是多个，通过多个参数传递
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method without
	 * @return {Array} 删除后的数组
	 */
	without: function() {
		var values = $A(arguments);
		return this.find(function(value) {
			return !values.include(value);
		});
	},
	
	cpush: function() {
		var values = $A(arguments);
		values.each(function(value) {
			if (!this.include(value)) this.push(value);
		}, this);
	},
	
	/**
	 * 克隆数组
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method clone
	 * @return {Array} a clone of the array
	 */
	clone: function() {
    return [].concat(this);
  },
  
	/**
	 * 输出数组以查看
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method inspect
	 * @return {String} string
	 */
  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  },

	/**
	 * 数组转换成JSON
	 *
	 * @author from Prototype1.6
	 * @class Array
	 * @method toJSON
	 * @return {String} JSON String
	 */
	toJSON: function() {
		var results = [];
		this.each(function(object) {
			var value = Object.toJSON(object);
			if (!Object.isUndefined(value)) results.push(value);
		});
		return '[' + results.join(', ') + ']';
	}
	
});

Array.prototype.toArray = Array.prototype.clone;

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.trim();
  return string ? string.split(/\s+/) : [];
}