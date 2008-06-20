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
		script: '<script[^>]*>([\\S\\s]*?)<\/script>', 
		jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/
	},
	
	weekday: {
		short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	},
	
	month: {
		short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aguest', 'September', 'October', 'November', 'December']
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
	
	/**
	 * 指定的字符串是否在自身中存在
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method include
	 * @param {String:pattern} 指定的字符串
	 * @return {Boolean} true or false
	 */
	include: function(pattern) {
		return this.indexOf(pattern) > -1;
	},
	
	/**
	 * 截取字符串
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method cut
	 * @param {Integer:length} 截断后的长度，这个长度是包含了tail的
	 * @param {String:tail} 尾部结束字符
	 * @return {String} string
	 */
	cut: function(length, tail) {
		length = length || 30;
		tail = tail ? tail : '...';
		return this.length > length ? this.slice(0, length - tail.length) : String(this);
	},
	
	/**
	 * 将html tag从字符串里移除
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method stripTags
	 * @return {String} string
	 */
	stripTags: function() {
		return this.replace(/<\/?[^>]+>/ig, '');
	},
	
	/**
	 * 将script标签从字符串里移除
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method stripScripts
	 * @return {String} string
	 */
	stripScripts: function() {
		return this.replace(new RegExp(String.patterns.script, 'img'), '');
	},
	
	/**
	 * 转义字符串里html tag
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method escapeHTML
	 * @return {String} string
	 */
	escapeHTML: function() {
		var self = arguments.callee;
		self.text.data = this;
		return self.div.innerHTML;
	},
	
	/**
	 * 使被转义的html tag恢复
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method unescapeHTML
	 * @return {String} string
	 */
	unescapeHTML: function() {
		var d = Element('div');
		d.innerHTML = String(this);
		return d.childNodes[0] ? d.childNodes.length > 1 ? 
			$A(d.childNodes).inject('', function(memo, node) { return memo + node.nodeValue }) : d.childNodes[0].nodeValue : '';
	},
	
	/**
	 * 字符串转化成字符数组
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method toArray
	 * @return {Array} string array
	 */
	toArray: function() {
		return this.split('');
	},
	
	/**
	 * 字符串是否使空白的，即由空白字符组成的
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method blank
	 * @return {String} string
	 */
	blank: function() {
    return /^\s*$/.test(this);
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
	},
	
	/**
	 * 根据指定的filter替换JSON字符串
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method unfilterJSON
	 * @param {RegExp:filter} 正则表达式对象
	 * @return {String} string
	 */
	unfilterJSON: function(filter) {
    return this.replace(filter || String.patterns.jsonFilter, '$1');
  },

	/**
	 * 判断是不是有效的JSON字符串
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method isJSON
	 * @return {String} string
	 */
  isJSON: function() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  },
  
	/**
	 * 执行JSON字符串，使之成为可用的JSON Object
	 *
	 * @author from prototype1.6
	 * @class String
	 * @method repeat
	 * @param {Integer:count} 重复的次数
	 * @return {String} string
	 */
  evalJSON: function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }
	
});

// IE如果使用element来做转义会产生不标准的代码，所以单独定义
if (JPlus.Browser.IE) Object.extend(String.prototype, {
	escapeHTML: function() {
		return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},
	
	unescapeHTML: function() {
		return this.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
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