// 
//  对String的扩展，以及相关方法
//  JPlus -> string.js
//  
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },

  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  },

	patterns: {
		script: '<script[^>]*>([\\S\\s]*?)<\/script>'
	}
});

/**
 * 使用_split代替原有的split方法，原split将会在下面被重定义掉
 * 它们二者的区别就是，_split不会去除头尾的空白，而split会自动去除头尾的空白
 *
 * @author nowa
 * @class String
 * @method _split
 * @return {Array} array
 */
String.prototype._split = String.prototype.split;

// 对String的扩展
Object.extend(String.prototype, {
	
	/**
	 * 清除字符串头部和尾部的空白
	 *
	 * @author from Prototype1.6
	 * @class String
	 * @method trim
	 * @return {String} string
	 */
	trim: function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	
	/**
	 * 将一个字符串清除头尾空白后分割为子字符串，然后将结果作为字符串数组返回
	 *
	 * @author nowa
	 * @class String
	 * @method split
	 * @param {(String|RegExp):separator} 使用字符串或者正则表达式对象来分隔字符串
	 * @param {Integer:limit} 用来限制返回数组中的元素个数
	 * @return {Array} array
	 */
	split: function(separator, limit) {
		if (!separator) return this;
		return this.trim()._split(separator, limit);
	},
	
	/**
	 * replace方法的增强版本，除了replace的功能外，replacement还可以是一个函数，其默认被传递了参数match
	 *
	 * @author based on Prototype1.6
	 * @class String
	 * @method gsub
	 * @param {(String|RegExp):pattern} 要被替换掉的字符串或者正则表达式对象
	 * @param {(String|Function):replacement} 替换后的字符串
	 * @return {String} string
	 */
	gsub: function(pattern, replacement) {
		var result = '', source = this, match;
		var _replacement = Object.isFunction(replacement) ? replacement : arguments.callee._replacement(replacement);
		
		while (source.length > 0) {
			if (match = source.match(pattern)) {
				result += source.slice(0, match.index);
				result += String.interpret(_replacement(match));
				source = source.slice(match.index + match[0].length);
			} else {
				result += source; source = '';
			}
		}
		
		return result;
	},
	
	/**
	 * 类似于gsub，但是默认只替换一处，使用count可以指定替换的个数
	 *
	 * @author based on Prototype1.6
	 * @class String
	 * @method sub
	 * @param {(String|RegExp):pattern} 要被替换掉的字符串或者正则表达式对象
	 * @param {(String|Function):replacement} 替换后的字符串
	 * @param {Integer:count} 替换的个数
	 * @return {String} string
	 */
	sub: function(pattern, replacement, count) {
		var _replacement = Object.isFunction(replacement) ? replacement : this.gsub._replacement(replacement);
		count = count || 1;
		
		return this.gsub(pattern, function(match) {
			if (--count < 0) return match[0];
			return _replacement(match);
		});
	},
	
	/**
	 * 重复自身count次
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method repeat
	 * @param {Integer:count} 重复的次数
	 * @return {String} string
	 */
	repeat: function(count) {
		return count < 1 ? '' : new Array(count + 1).join(this);
	},
	
	include: function(pattern) {
		return this.indexOf(pattern) > -1;
	},
	
	cut: function(length, tail) {
		length = length || 30;
		tail = tail ? tail : '...';
		return this.length > length ? this.slice(0, length - tail.length) : String(this);
	},
	
	stripScripts: function() {
		return this.replace(new RegExp(String.patterns.script, 'img'), '');
	},
	
	escapeHTML: function() {
		var self = arguments.callee;
		self.text.data = this;
		return self.div.innerHTML;
	},
	
	unescapeHTML: function() {
		
	},
	
	/**
	 * 输出字符串以查看，控制字符将被转义
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method inspect
	 * @param {Boolean:useDoubleQuotes} 是否使用双引号输出，默认使用单引号
	 * @return {String} string
	 */
	inspect: function(useDoubleQuotes) {
		var escapedString = this.gsub(/\x00-\x1f\\/, function(match) {
			var character = String.specialChar[match[0]];
			return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
		});
		if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
		return "'" + escapedString.replace(/'/g, "\\'") + "'";
	},
	
	/**
	 * 转换成JSON字串
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method toJSON
	 * @return {String} json string
	 */
	toJSON: function() {
		return this.inspect(true);
	}
	
});

/**
 * gsub的子方法，之所以独立出来是为了方便在其他类里重载
 *
 * @author nowa
 * @class String.gsub
 * @method _replacement
 * @param {String:replacement} 替换字符串
 * @return {Function} function
 */
String.prototype.gsub._replacement = function(replacement) {
	return function(match) {return replacement};
};

Object.extend(String.prototype.escapeHTML, {
  div:  document.createElement('div'),
  text: document.createTextNode('')
});

String.prototype.escapeHTML.div.appendChild(String.prototype.escapeHTML.text);

// 方法映射
Object.extend(String.prototype, {
	times: String.prototype.repeat
});