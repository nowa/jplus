// 
//  对enumerable对象具有普适意义的扩展
//  JPlus -> enumerable.js
//  
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.welost.us. All rights reserved.
// 

var $break = {};

var Enumerable = {
	
	/**
	 * 以给定的迭代器迭代对象
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method each
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Enumerable Object} Enumerable object
	 */
	each: function(iterator, context) {
		var index = 0;
		try	{
			this._each(function(value) {
				iterator.call(context, value, index++);
			});
		} catch(e) {
			if (e != $break) throw e;
		}
		return this;
	},
	
	/**
	 * 以指定的迭代器迭代所有成员，并返回各个迭代的与结果
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method all
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {BOOL} true or false
	 */
	all: function(iterator, context) {
		iterator = iterator || JPlus.K;		// 迭代器可以不指定，默认采用empty function
		var result = true;
		this.each(function(value, index) {
			result = result && !!iterator.call(context, value, index);
			if (!result) throw $break;
		});
		return result;
	},
	
	/**
	 * 以指定的迭代器迭代所有成员，并返回各个迭代的或结果
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method any
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {BOOL} true or false
	 */
	any: function(iterator, context) {
		iterator = iterator || JPlus.K;
		var result = false;
		this.each(function(value, index) {
			if (result = !!iterator.call(context, value, index)) throw $break;
		});
		return result;
	},
	
	/**
	 * 返回一个新的数组，该数组的成员是原数组成员迭代后的值
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method collect
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Array} 迭代后的数组
	 */
	collect: function(iterator, context) {
		iterator = iterator || JPlus.K;
		var results = [];
		this.each(function(value, index) {
			results.push(iterator.call(context, value, index));
		});
		return results;
	},
	
	/**
	 * 精确比较并返回匹配值
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method detect
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Object} 匹配的元素
	 */
	detect: function(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },
	
	/**
	 * 返回数组里匹配迭代器条件的数组项
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method find
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Array} 迭代后匹配的数组
	 */
	find: function(iterator, context) {
		var results = [];
		this.each(function(value, index) {
			if (iterator.call(context, value, index)) results.push(value);
		});
		return results;
	},
	
	/**
	 * 对匹配filter条件的数组项做迭代并返回
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method grep
	 * @param {String:filter} 符合正则语法的String
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Array} 匹配filter并迭代后的项组成的数组
	 */
	grep: function(filter, iterator, context) {
		iterator = iterator || JPlus.K;
		var results = [];
		
		if (Object.isString(filter)) 
			filter = new RegExp(filter);
			
		this.each(function(value, index) {
			if (filter.match(value)) 
				results.push(iterator.call(context, value, index));
		});
		return results;
	},
	
	/**
	 * 判断给定参数是否在数组里
	 *
	 * @author from Prototype
	 * @class Enumerable
	 * @method include
	 * @param {Object:object} 被检查对象
	 * @return {BOOL} true or false
	 */
	include: function(object) {
		var result = false;
		this.each(function(value) {
			if (value == object) {
				result = true;
				throw $break;
			}
		});
		return result;
	},
	
	/**
	 * 迭代调用数组项的某个方法
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method invoke
	 * @param {String:method} 方法名
	 * @return {Array} 返回各个数组项执行方法后返回的结果集
	 */
	invoke: function(method) {
		var args = $A(arguments).slice(1);
		return this.map(function(value) {
			return value[method].apply(value, args);
		});
	},
	
	/**
	 * 返回数组迭代后最大值项
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method max
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Object} 最大值
	 */
	max: function(iterator, context) {
		iterator = iterator || JPlus.K;
		var result;
		this.each(function(value, index) {
			value = iterator.call(context, value, index);
			if (result == null || value > result) result = value;
		});
		return result;
	},
	
	/**
	 * 返回数组迭代后最小值项
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method min
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Object} 最小值
	 */
	min: function(iterator, context) {
		iterator = iterator || JPlus.K;
		var result;
		this.each(function(value, index) {
			value = iterator.call(context, value, index);
			if (result == null || value < result) result = value;
		});
		return result;
	},
	
	/**
	 * 遍历数组返回每个元素的指定属性值集合
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method pluck
	 * @param {String:property} 属性名
	 * @return {Array} 属性值集合
	 */
	pluck: function(property) {
		var results = [];
		this.each(function(value) {
			results.push(value[property]);
		});
		return results;
	},
	
	/**
	 * 返回数组迭代后最小值项
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method min
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Object} 最小值
	 */
	sortBy: function(iterator, context) {
		return this.map(function(value, index) {
			return {
				value: value,
				criteria: iterator.call(context, value, index)
			};
		}).sort(function(left, right) {
			var a = left.criteria, b = right.criteria;
			return a < b ? -1 : a > b ? 1 : 0;
		}).pluck('value');
	},
	
	/**
	 * 可遍历集合转换成数组
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method toArray
	 * @return {Array} array
	 */
	toArray: function() {
    return this.map();
  },

	/**
	 * 对象的长度
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method size
	 * @return {integer} 整数
	 */
	size: function() {
    return this.toArray().length;
  },

	/**
	 * 查看对象，类似于toString
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method inspect
	 * @return {String} string
	 */
	inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
	
};

// 方法名映射
Object.extend(Enumerable, {
	map: Enumerable.collect
});