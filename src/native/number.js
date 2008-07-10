// 
//  对Number的扩展
//  JPlus -> number.js
//  
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

Object.extend(Number.prototype, {
	
	seconds: function(d) {
		var _d = d ? d : Date.now();
		_d.setSeconds(_d.second() + this)
		return _d;
	},
	
	minutes: function(d) {
		var _d = d ? d : Date.now();
		_d.setMinutes(_d.minute() + this)
		return _d;
	},
	
	hours: function(d) {
		var _d = d ? d : Date.now();
		_d.setHours(_d.hour() + this)
		return _d;
	},
	
	days: function(d) {
		var _d = d ? d : Date.now();
		_d.setDate(_d.day() + this)
		return _d;
	},
	
	months: function(d) {
		var _d = d ? d : Date.now();
		_d.setMonth(_d.getMonth() + this)
		return _d;
	},
	
	years: function(d) {
		var _d = d ? d : Date.now();
		_d.setFullYear(_d.year() + this)
		return _d;
	},
	
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
	},
	
	to_day: function() {
		return this / (1000 * 60 * 60 * 24);
	},
	
	to_hour: function() {
		return this / (1000 * 60 * 60);
	},
	
	to_minute: function() {
		return this / (1000 * 60);
	}
	
});

$w('abs round ceil floor').each(function(method) {
	Number.prototype[method] = Math[method].methodize();
});