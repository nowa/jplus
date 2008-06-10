/**
 * 对enumerable对象具有普适意义的扩展
 */

var $break = { };

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
		iterator = iterator || JPlus.K;
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
			if (result = !!iterator.call(context, value, index))) throw $break;
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
	}
	
}