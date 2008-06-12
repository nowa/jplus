// 
//  对Number的扩展
//  JPlus -> number.js
//  
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.welost.us. All rights reserved.
// 

Object.extend(Number.prototype, {
	
	/**
	 * 类ruby语法的迭代
	 *
	 * @author nowa
	 * @class Number
	 * @method times
	 * @param {Object:iterator} 迭代器
	 * @param {Object:context} 上下文对象
	 * @return {Number} number
	 */
	times: function(iterator, context) {
		new Array(parseInt(this)).each(iterator, context);
		return this;
	},
	
	/**
	 * 数字转换成指定进制、指定长度的字符串，不足的在高位以0补全
	 *
	 * @author from prototype1.6
	 * @class Number
	 * @method toPaddedString
	 * @param {Integer:length} 长度
	 * @param {Integer:radix} 进制
	 * @return {String} string
	 */
	toPaddedString: function(length, radix) {
		var string = this.toString(radix || 10);
		return '0'.repeat(length - string.length) + string;
	},
	
	/**
	 * 转换成JSON字串
	 *
	 * @author from prototype1.6
	 * @class Number
	 * @method toJSON
	 * @return {String} json string
	 */
	toJSON: function() {
		return isFinite(this) ? this.toString() : 'null';
	}
	
});