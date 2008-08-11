/*  JPlus JavaScript framework, version 0.1.0.2
 *  (c) 2008 nowa(nowazhu@gmail.com)、cricy(feiyelanghai@gmail.com)
 *
 *  JPlus is based Prototype Javascript Framework,
 *  and freely distributable under the terms of an MIT-style license.
 *  For details, see the JPlus web site: http://jplus.welost.us/
 *
 *  这是一个Ruby风格的框架，从它里面借鉴了不少东西。很多代码来自Prototype和mootools，感谢它们的开发者们。
 *  2008-05-16 Hangzhou, China.
 *
 *--------------------------------------------------------------------------*/

var JPlus = {
	Version: '0.1.0.2',

	emptyFunction: function() { },
	K: function(x) {return x}
}

function $defined(obj){
	return (obj != undefined);
};

function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

function $type(obj){
	if (obj == undefined) return false;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.callee) return 'arguments';
		else if (obj.item) return 'collection';
	}
	if (Object.isArray(obj)) return 'array';
	if (Object.isString(obj)) return 'string';
	if (Object.isFunction(obj)) return 'function';
	if (Object.isNumber(obj)) return 'number';
	if (Object.isHash(obj)) return 'hash';
	if (Object.isDate(obj)) return 'date';
	if (Object.isRegExp(obj)) return 'regexp';
	return typeof obj;
};

function $pick(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if ($defined(arguments[i])) return arguments[i];
	}
	return null;
};

function $try(fn, bind, args){
	try {
		return fn.apply(bind, $splat(args));
	} catch(e){
		return false;
	}
};

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

//
//  浏览器相关
//  JPlus -> browser.js
//
//  Created by nowa on 2008-06-12.
//  Copyright 2008 jplus.welost.us. All rights reserved.
//

// from prototype 1.6
// 浏览器识别
JPlus.Browser = {
	Version: navigator.userAgent,
	IE:     !!(window.attachEvent && !window.opera),
	Opera:  !!window.opera,
	WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
	Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
	MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
}

// from prototype 1.6
// 浏览器特性侦测
JPlus.BrowserFeatures = {
  XPath: !!document.evaluate,
  SelectorsAPI: !!document.querySelector,

	// element构造对象，一旦修改了HTMLElement的prototype将影响到所有的element
  ElementExtensions: !!window.HTMLElement,

	// element的原型父链，指向window.Element，针对特定element做扩展
  SpecificElementExtensions:
    document.createElement('div')['__proto__'] &&
    document.createElement('div')['__proto__'] !==
      document.createElement('form')['__proto__']
}

if (JPlus.Browser.MobileSafari)
  JPlus.BrowserFeatures.SpecificElementExtensions = false;

function $exec(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};
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
//
//  对Function的扩展
//  JPlus -> function.js
//
//  Created by nowa on 2008-07-01.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

Object.extend(Function.prototype, {

	/**
	 * 返回参数的数组列表
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method argumentNames
	 * @return {Array} arguments array
	 */
	argumentNames: function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  },

	/**
	 * bind不会让this指针被劫持，它用于绑定上下文（this）
	 * 或者也可以说让一个没有m方法的b对象具备m方法： a.m.bind(b)
	 * 和call、apply有相同之处，但是可以传递两次参数
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method bind
	 * @return {Function} function
	 */
	bind: function() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = $A(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat($A(arguments)));
    }
  },

	bindAsEventListener: function() {
    var __method = this, args = $A(arguments), object = args.shift();
    return function(event) {
      return __method.apply(object, [event || window.event].concat(args));
    }
  },

	curry: function() {
    if (!arguments.length) return this;
    var __method = this, args = $A(arguments);
    return function() {
      return __method.apply(this, args.concat($A(arguments)));
    }
  },

	delay: function() {
		var __method = this, args = $A(arguments), timeout = args.shift();
		return window.setTimeout(function() {
			return __method.apply(__method, args);
			}, timeout);
  },

	/**
	 * 使用指定的function作为wrapper来包装自身
	 *
	 * @author from Prototype1.6
	 * @class Function
	 * @method wrap
	 * @return {Function} function
	 */
	wrap: function(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, [__method.bind(this)].concat($A(arguments))); 		// 之所以要bind是为了将this传递到wrapper里去，否则是不具备对当前对象的引用的
    }
  },

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

//
//  类机制实现
//  JPlus -> class.js
//
//  Created by nowa on 2008-07-01.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

var Class = {
	create: function() {
		var parent = null, properties = $A(arguments);
		if (Object.isFunction(properties[0])) parent = properties.shift();

		function klass () {
			this.initialize.apply(this, arguments);

			['implement'].each(function(prop) {
				if (!this[prop]) return;
				Class[prop](this, this[prop]);
				delete this[prop];
			}, this);
		}

		Object.extend(klass, Class.Methods);
		klass.superclass = parent;
		klass.subclasses = [];

		if (parent) {
			var subclass = function() {};
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass;		// 仅仅需要从parent继承原型对象，parent构造函数里定义的实例属性 并不需要，所以使用了subclass
			parent.subclasses.push(klass);
		}

		for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

		if (!klass.prototype.initialize)
      klass.prototype.initialize = JPlus.emptyFunction;

		klass.prototype.constructor = klass;
		return klass;
	},

	implement: function(self, klasses) {
		$splat(klasses).each(function(k) {
			Object.extend(self, (typeof k).toLowerCase() == 'function' ? new k(JPlus.emptyFunction) : k);
		});
	}
};

Class.Methods = {
	addMethods: function(source) {
		var ancestor   = this.superclass && this.superclass.prototype;		// 如果是一个继承
    var properties = Object.keys(source);

		if (!Object.keys({ toString: true }).length)
      properties.push("toString", "valueOf");

		for (var i = 0, length = properties.length; i < length; i++) {
			var property = properties[i], value = source[property];
			// 支持$super父类同名方法调用
			if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value, value = Object.extend((function(m) {
          return function() { return ancestor[m].apply(this, arguments) };
        })(property).wrap(method), {
          valueOf:  function() { return method },
          toString: function() { return method.toString() }
        });
      }
      this.prototype[property] = value;
		}

		return this;
	}
};

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

	succ: function() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
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

	extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },

  evalScripts: function() {
    return this.extractScripts().map(function(script) { return eval(script) });
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

	toQueryParams: function(separator) {
    var match = this.trim().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
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

	to_i: function(radix) {
		return parseInt(this, radix || 10);
	},

	to_date: function() {
		var _this = this.split('-');
		if (_this.length < 3) return null;
		return new Date(_this[0], _this[1].to_i() - 1, _this[2]);
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
	 * @param {Boolean:sanitize} 不eval
	 * @return {String} string
	 */
  evalJSON: function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { throw new SyntaxError('Badly formed JSON string: ' + this.inspect()); }
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
			if (e != $break) { throw e; }
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
	 * 返回迭代增量值memo
	 *
	 * @author from Prototype1.6
	 * @class Enumerable
	 * @method inject
	 * @param {Object:memo} 增量
	 * @param {Function:iterator} 迭代器
	 * @param {Object:context} 迭代器的上下文对象
	 * @return {Object} 迭代后的增量
	 */
	inject: function(memo, iterator, context) {
		this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
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

	unique: function() {
		var uniques = [];
		this.each(function(value) {
			if (uniques.include(value)) return;
			uniques.push(value);
		});

		return uniques;
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

	associate: function(keys){
		var length = Math.min(this.length, keys.length);
		return this.inject({}, function(obj, value, index) {
			obj[keys[index]] = value;
			return obj;
		});
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

	link: function(object){
		return this.inject({}, function(result, value) {
			for (var key in object) {
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
			return result;
		});
	},

	flatten: function(){
		return this.inject([], function(array, value) {
			var _type;
			if (_type = $type(value))
				array = array.concat((_type == 'array' || _type == 'collection' || _type == 'arguments') ? value.flatten() : value);
			return array;
		});
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
		new Array(parseInt(this)).map(function(value, index) {return index}).each(iterator, context);
		return this;
	},

	succ: function() {
    return this + 1;
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
  },

	toQueryString: function() {
		return this.inject([], function(results, pair) {
			var key = encodeURIComponent(pair.key), values = pair.value;
			results = results.concat($splat(values).map(function(value) {return key + '=' + encodeURIComponent(String.interpret(value))}));
			return results;
		}).join('&');
	}

});
//
//  对Date对象的扩展
//  JPlus -> date.js
//
//  Created by nowa on 2008-06-19.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

Object.extend(Date, {

	now: function() {
		return new Date();
	},

	formats: {
		'%a': 'shortWeekday',
		'%A': 'longWeekday',
		'%b': 'shortMonthName',
		'%B': 'monthName',
		'%d': 'day',
		'%y': 'shortYear',
		'%Y': 'year',
		'%m': 'month',
		'%M': 'minute',
		'%H': 'hour',
		'%I': 'ihour',
		'%S': 'second',
		'%p': 'mindicator',
		'%w': 'weekday'
	}

});

Object.extend(Date.prototype, {

	year: Date.prototype.getFullYear,
	day: Date.prototype.getDate,
	hour: Date.prototype.getHours,
	minute: Date.prototype.getMinutes,
	second: Date.prototype.getSeconds,
	msecond: Date.prototype.getMilliseconds,
	weekday: Date.prototype.getDay,

	month: function() {
		return this.getMonth() + 1;
	},

	shortWeekday: function() {
		return String.weekday.short[this.weekday()];
	},

	longWeekday: function() {
		return String.weekday.long[this.weekday()];
	},

	shortMonthName: function() {
		return String.month.short[this.getMonth()];
	},

	monthName: function() {
		return String.month.long[this.getMonth()];
	},

	shortYear: function() {
		return this.year().toString().slice(2);
	},

	ihour: function() {
		var __hour = this.hour();
		return __hour > 12 ? __hour - 12 : __hour;
	},

	mindicator: function() {
		return this.hour() > 12 ? 'PM' : 'AM';
	},

	strftime: function(format) {
		var match, format = format.replace('\\%', '{PER}');
		if (match = format.match(/(\%[\w\%]{1})/ig)) {
			match.each(function(value) {
				try {
					format = format.gsub(value, eval('this.' + Date.formats[value] + '()'));
				} catch(e) {
					throw new SyntaxError('Badly format string: ' + format.inspect());
				}
			}, this);
		}
		return format.gsub('{PER}', '%');
	},

	after: function(format, offset) {
		var _c = this.clone();
		eval('_c.set' + format + '(_c.get' + format + '() + ' + offset + ')');
		return _c;
	},

	clone: function() {
		return new Date(this.year(), this.getMonth(), this.day(), this.hour(), this.minute(), this.second(), this.msecond());
	},

	inspect: function() {
		return "'" + this.toString() + "'";
	},

	toJSON: function() {
		return this.inspect();
	},

	to_s: function() {
		return this.year() + '-' + this.month() + '-' + this.day();
	}

});
//
//  Range
//  JPlus -> range.js
//
//  Created by nowa on 2008-07-21.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

// from prototype1.6
var ObjectRange = Class.create(Enumerable, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },

  _each: function(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  },

  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
};

/**
 * DOM相关
 */

/**
 * 根据id获取html element
 *
 * @author from Prototype1.6
 * @method $
 * @param {Object} 参数可以是Array也可以是String
 * @return {Array or Element} 如果参数是Array，那么返回值也是一个element数组；如果参数是String，返回值是element object
 */
function $(element, notrash) {
  if ($type(element) == 'array') {
    for (var i = 0, elements = [], length = element.length; i < length; i++)
      elements.push($(element[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
	element.uid = element.uid || [Element.UID++];
  return (!notrash) ? Element.extend(element) : element;
}

function $i(id) {
	return document.getElementById(id);
}

// element constructor
(function() {
	var element = this.Element;
	this.Element = function(tagName, attributes) {
		attributes = attributes || {};
		tagName = tagName.toLowerCase();
		var _element = Element.extend(document.createElement(tagName));
		for (var attr in attributes) {
			_element.setAttribute(attr, attributes[attr]);
		}
		return _element;
	}
	Object.extend(this.Element, element || {});
	if (element) this.Element.prototype = element.prototype;
}).call(window);

Element.UID = 0;

Element.Storage = {

	get: function(uid){
		return (this[uid] = this[uid] || {});
	}

};

Element.Methods = {
	/*
	 * 元素可见状态
	 *
	 * @author from Prototype1.6
	 * @class Element.Methods
	 * @method visible
	 * @param {HTMLElement} html元素
	 * @return {BOOLEAN} 布尔值
	 */
	visible : function(element) {
		return $(element).style.display != 'none';
	},

	/*
	 * 显示元素
	 *
	 * @author from Prototype1.6
	 * @class Element.Methods
	 * @method show
	 * @param {HTMLElement} html元素
	 * @param {String:d} block or inline or others
	 * @return {HTMLElement} html元素
	 */
	show : function(element, d) {
		$(element).style.display = d ? d : '';
    return element;
	},

	set: function(element, prop, value){
		element = $(element);
		switch ($type(prop)){
			case 'object':
				for (var p in prop) element.set(p, prop[p]);
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				(property && property.set) ? property.set.apply(element, $A(arguments).slice(1)) : element.setProperty(prop, value);
		}
		return element;
	},

	get: function(element, prop) {
		element = $(element);
		var property = Element.Properties.get(prop);
		return (property && property.get) ? property.get.apply(element, $A(arguments).slice(1)) : element.getProperty(prop);
	},

	erase: function(element, prop){
		element = $(element);
		var property = Element.Properties.get(prop);
		(property && property.erase) ? property.erase.apply(element, $A(arguments).slice(1)) : element.removeProperty(prop);
		return element;
	},

	setProperty: function(element, attribute, value){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute], hasValue = value ? value : !!value;
		if (key && EA.Bools[attribute]) value = (value || !hasValue) ? true : false;
		else if (!hasValue) return element.removeProperty(attribute);
		(key) ? element[key] = value : element.setAttribute(attribute, value);
		return element;
	},

	getProperty: function(element, attribute){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute];
		var value = (key) ? element[key] : element.getAttribute(attribute);
		return (EA.Bools[attribute]) ? !!value : value;
	},

	removeProperty: function(element, attribute){
		element = $(element);
		var EA = Element.Attributes, key = EA.Props[attribute], isBool = (key && EA.Bools[attribute]);
		(key) ? element[key] = (isBool) ? false : '' : element.removeAttribute(attribute);
		return element;
	},

	getElements: function(element, tags) {
		if (Object.isString(tags)) tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag) {
			partial = this.getElementsByTagName(tag.trim());
			elements = (ddup) ? elements.concat($A(partial)) : $A(partial);
		}, $(element));

		return elements.unique().map(function(el) {
			return $(el);
		});
	},

	toQueryString: function(element) {
		return $(element).getElements('input, select, textarea').inject([], function(results, el) {
			var name = el.name, type = el.type, value = el.get('value');
			if (value === false || !name || el.disabled) return;
			$splat(value).each(function(val) {
				results.push(name + '=' + encodeURIComponent(val));
			});
			return results;
		}).join('&');
	},

	retrieve: function(element, property, dflt){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		var prop = storage[property];
		if ($defined(dflt) && !$defined(prop)) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(element, property, value){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		storage[property] = value;
		return element;
	},

	eliminate: function(element, property){
		element = $(element);
		var storage = Element.Storage.get(element.uid);
		delete storage[property];
		return element;
	}
};

// Element的方法
(function() {
	/*
	 * 将给定object的方法methodize
	 *
	 * @author nowa
	 * @class Element
	 * @method methodizeMethods
	 * @param {Object} object
	 * @return {Object} object
	 */
	this.methodizeMethods = function(methods) {
		var property, value, methods = methods || this.Methods, _Methods = {};
		for (property in methods) {
			value = methods[property];
			if (Object.isFunction(value) && !(property in _Methods))
				_Methods[property] = value.methodize();
		}
		return _Methods;
	};

	/*
	 * 将Methods添加到element实例，仅针对不支持element.__proto__特性的浏览器
	 *
	 * @author based on Prototype1.6
	 * @class Element
	 * @method extend
	 * @param {HTMLElement} html元素
	 * @return {HTMLElement} html元素
	 */
	this.extend = (function() {
		if (JPlus.BrowserFeatures.SpecificElementExtensions)
			return JPlus.K;

		var Methods = { };

		var extend = Object.extend(function(element) {
			if (!element || element._extendedByPrototype ||
	        element.nodeType != 1 || element == window) return element;

			Object.extend(element, Element.methodizeMethods(Methods));

			element._extendedByPrototype = JPlus.emptyFunction;
	    return element;
		}, {
			refresh: function() {
	      // extend methods for all tags (Safari doesn't need this)
	      if (!JPlus.BrowserFeatures.ElementExtensions) {
	        Object.extend(Methods, Element.Methods);
	      }
	    }
		});

		extend.refresh();
		return extend;
	})();

	/*
	 * 给Element添加方法
	 *
	 * @author based on Prototype1.6
	 * @class Element
	 * @method addMethods
	 * @param {Object:methods} methods hash
	 */
	this.addMethods = function(methods) {
	  Object.extend(Element.Methods, methods || { });

	  if (JPlus.BrowserFeatures.ElementExtensions) {
			Object.extend(HTMLElement.prototype, this.methodizeMethods(Element.Methods));
	  }

	  Object.extend(Element, Element.Methods);

	  if (Element.extend.refresh) Element.extend.refresh();
	};
}).call(Element);

Object.extend(Element, Element.Methods);

// 判断浏览器是否是支持element.__proto__而不支持window.HTMLElement，如果是，则构造一个window.HTMLElement作为element.__proto__的原型父链
if (!JPlus.BrowserFeatures.ElementExtensions &&
    document.createElement('div')['__proto__']) {
  window.HTMLElement = { };
  window.HTMLElement.prototype = document.createElement('div')['__proto__'];
  JPlus.BrowserFeatures.ElementExtensions = true;
}

// 将Methods添加到window.HTMLElement，它是html element的constructor
if (JPlus.BrowserFeatures.ElementExtensions)
	Object.extend(window.HTMLElement.prototype, Element.methodizeMethods());

Element.Properties = new Hash({
	style: {
		set: function(style){
			this.style.cssText = style;
		},

		get: function(){
			return this.style.cssText;
		},

		erase: function(){
			this.style.cssText = '';
		}
	},

	value: {
		get: function() {
			switch (this.get('tag')){
				case 'select':
					var values = [];
					$A(this.options).each(function(option){
						if (option.selected) values.push(option.value);
					});
					return (this.multiple) ? values : values[0];
				case 'input': if (['checkbox', 'radio'].include(this.type) && !this.checked) return false;
				default: return $pick(this.value, false);
			}
		}
	},

	tag: {
		get: function(){
			return this.tagName.toLowerCase();
		}
	},

	html: {
		set: function(){
			return this.innerHTML = $A(arguments).flatten().join('');
		}
	}
});

Element.Attributes = {
	Props: {'html': 'innerHTML', 'class': 'className', 'for': 'htmlFor', 'text': (JPlus.Browser.IE) ? 'innerText' : 'textContent'},
	Bools: ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'],
	Camels: ['value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap']
};

(function(EA){

	var EAB = EA.Bools, EAC = EA.Camels;
	EA.Bools = EAB = EAB.associate(EAB);
	EA.Props = $H(EA.Props).merge(EAB).update(EAC.associate(EAC.map(function(v){
		return v.toLowerCase();
	}))).toObject();
	delete EA.Camels;

})(Element.Attributes);
//
//  事件类实现，支持自定义事件
//  JPlus -> event.js
//
//  Created by nowa on 2008-06-23.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

var Event = window.Event || {};

/*
	TODO addEvent可以返回一个对象使其可以调用subscribe方法添加事件响应
*/
Event.Customs = Class.create({

	addEvent: function(type, fn, internal) {
		if (Object.isFunction(fn)) {
			this._events = this._events || {};
			this._events[type] = this._events[type] || [];
			this._events[type].cpush(fn);
			if (internal) fn.internal = true;
		}
		return this;
	},

	addEvents: function(events) {
		for (type in events) this.addEvent(type, events[type]);
		return this;
	},

	// options: {'delay': delay, 'event': event, 'bind': object}
	fireEvent: function(type, args, options) {
		if (!this._events || !this._events[type]) return this;
		options = options || {};
		options.bind = options.bind || this;
		args = args || [];
		args = options.event ? [options.event].concat($A(args)) : args;
		this._events[type].each(function(fn) {
			var _call = function() { return fn.apply(options.bind, args) };
			if ($defined(options.delay))
				_call.delay(options.delay);
			else
				_call();
		});
		return this;
	},

	removeEvent: function(type, fn) {
		if (!this._events || !this._events[type]) return this;
		if (!fn.internal) this._events[type].without(fn);
		return this;
	},

	removeEvents: function(type) {
		if (!this._events || !this._events[type]) return this;
		this._events[type].clear();
		return this;
	}

});

Event.Methods = {

	stop: function(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();
    event.stopped = true;
  }

}

Event.extend = (function() {
  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (JPlus.Browser.IE) {
    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return "[object Event]" }
    });

    return function(event) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = JPlus.emptyFunction;

			// fixes based on jQuery 1.2.6

			// Fix target property, if necessary
			if ( !event.target )
				event.target = event.srcElement || document;

			// check if target is a textnode (safari)
			if ( event.target.nodeType == 3 )
				event.target = event.target.parentNode;

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && event.fromElement )
				event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && event.clientX != null ) {
				var doc = document.documentElement, body = document.body;
				event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
				event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
			}

			// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
			if ( !event.metaKey && event.ctrlKey )
				event.metaKey = event.ctrlKey;

			// Add which for click: 1 == left; 2 == middle; 3 == right
			// Note: button is not normalized, so don't use it
			if ( !event.which && event.button )
				event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

      return Object.extend(event, methods);
    };

  } else {
    Event.prototype = Event.prototype || document.createEvent("HTMLEvents")['__proto__'];
    Object.extend(Event.prototype, methods);
    return JPlus.K;
  }
})();

Event.Keys = new Hash({
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
  KEY_HOME:     36,
  KEY_END:      35,
  KEY_PAGEUP:   33,
  KEY_PAGEDOWN: 34,
  KEY_INSERT:   45
});
//
//  Element的常规事件以及自定义事件支持
//  JPlus -> element.event.js
//
//  Created by nowa on 2008-07-01.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

Event.cache = {};

Object.extend(Event, (function() {
  var cache = Event.cache || {};

  function getEventID(element) {
    // Event ID is stored as the 0th index in a one-item array so that it
    // won't get copied to a new node when cloneNode is called.
    if (element._prototypeEventID) return element._prototypeEventID[0];
    arguments.callee.id = arguments.callee.id || 1;

    return element._prototypeEventID = [++arguments.callee.id];
  }

  function getDOMEventName(eventName) {
    if (eventName && eventName.include(':')) return "dataavailable";
    return eventName;
  }

  function getCacheForID(id) {
    return cache[id] = cache[id] || { };
  }

  function getWrappersForEventName(id, eventName) {
    var c = getCacheForID(id);
    return c[eventName] = c[eventName] || [];
  }

  function createWrapper(element, eventName, handler) {
    var id = getEventID(element), _c = getCacheForID(id);

    // Attach the element itself onto its cache entry so we can retrieve it for
    // cleanup on page unload.
    if (!_c.element) _c.element = element;

    var c = getWrappersForEventName(id, eventName);
    if (c.pluck("handler").include(handler)) return false;

    var wrapper = function(event) {
      if (!Event || !Event.extend ||
        (event.eventName && event.eventName != eventName))
          return false;

      Event.extend(event);
      handler.call(element, event);
    };

    wrapper.handler = handler;
    c.push(wrapper);
    return wrapper;
  }

  function findWrapper(id, eventName, handler) {
    var c = getWrappersForEventName(id, eventName);
    return c.find(function(wrapper) { return wrapper.handler == handler });
  }

  function destroyWrapper(id, eventName, handler) {
    var c = getCacheForID(id);
    if (!c[eventName]) return false;
    c[eventName] = c[eventName].without(findWrapper(id, eventName, handler));
  }

  // Loop through all elements and remove all handlers on page unload. IE
  // needs this in order to prevent memory leaks.
  function purgeListeners() {
    var element, entry;
    for (var i in Event.cache) {
      entry = Event.cache[i];
      Event.stopObserving(entry.element);
      entry.element = null;
    }
  }

  function onStop() {
    document.detachEvent('onstop', onStop);
    purgeListeners();
  }

  function onBeforeUnload() {
    if (document.readyState === "interactive") {
      document.attachEvent('onstop', onStop);
      (function() { document.detachEvent('onstop', onStop); }).defer();
    }
  }

  if (window.attachEvent) {
    // Internet Explorer needs to remove event handlers on page unload
    // in order to avoid memory leaks.
    window.attachEvent("onunload", purgeListeners);

    // IE also doesn't fire the unload event if the page is navigated away
    // from before it's done loading. Workaround adapted from
    // http://blog.moxiecode.com/2008/04/08/unload-event-never-fires-in-ie/.
    window.attachEvent("onbeforeunload", onBeforeUnload);
  }

  // Safari has a dummy event handler on page unload so that it won't
  // use its bfcache. Safari <= 3.1 has an issue with restoring the "document"
  // object when page is returned to via the back button using its bfcache.
  if (JPlus.Browser.WebKit) {
    window.addEventListener('unload', JPlus.emptyFunction, false);
  }

  return {
    observe: function(element, eventName, handler) {
      element = $(element);
      var name = getDOMEventName(eventName);

      var wrapper = createWrapper(element, eventName, handler);
      if (!wrapper) return element;

      if (element.addEventListener) {
        element.addEventListener(name, wrapper, false);
      } else {
        element.attachEvent("on" + name, wrapper);
      }

      return element;
    },

    stopObserving: function(element, eventName, handler) {
      element = $(element);
      var id = getEventID(element), name = getDOMEventName(eventName);

      if (!handler && eventName) {
        getWrappersForEventName(id, eventName).each(function(wrapper) {
          Event.stopObserving(element, eventName, wrapper.handler);
        });
        return element;

      } else if (!eventName) {
        Object.keys(getCacheForID(id)).without("element").each(function(eventName) {
          Event.stopObserving(element, eventName);
        });
        return element;
      }

      var wrapper = findWrapper(id, eventName, handler);
      if (!wrapper) return element;

      if (element.removeEventListener) {
        element.removeEventListener(name, wrapper, false);
      } else {
        element.detachEvent("on" + name, wrapper);
      }

      destroyWrapper(id, eventName, handler);

      return element;
    },

    fire: function(element, eventName, memo) {
      element = $(element);
      if (element == document && document.createEvent && !element.dispatchEvent)
        element = document.documentElement;

      var event;
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("dataavailable", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "ondataavailable";
      }

      event.eventName = eventName;
      event.memo = memo || { };

      if (document.createEvent) {
        element.dispatchEvent(event);
      } else {
        element.fireEvent(event.eventType, event);
      }

      return Event.extend(event);
    }
  };
})());

Object.extend(Event, Event.Methods);

Element.addMethods({
  fire:          Event.fire,
  observe:       Event.observe,
  stopObserving: Event.stopObserving
});

Object.extend(document, {
  fire:          Element.Methods.fire.methodize(),
  observe:       Element.Methods.observe.methodize(),
  stopObserving: Element.Methods.stopObserving.methodize(),
  ready:        false
});

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards and John Resig. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.ready) return;
    if (timer) window.clearInterval(timer);
    document.fire("dom:ready");
    document.ready = true;
  }

  if (document.addEventListener) {
    if (JPlus.Browser.WebKit) {
      timer = window.setInterval(function() {
        if (/loaded|complete/.test(document.readyState))
          fireContentLoadedEvent();
      }, 0);

      Event.observe(window, "load", fireContentLoadedEvent);

    } else {
      document.addEventListener("DOMContentLoaded",
        fireContentLoadedEvent, false);
    }

  } else {
    document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
    $("__onDOMContentLoaded").onreadystatechange = function() {
      if (this.readyState == "complete") {
        this.onreadystatechange = null;
        fireContentLoadedEvent();
      }
    };
  }
})();
//
//  使用XMLHTTPRequest实现完整的http请求
//  JPlus -> request.js
//
//  Created by nowa on 2008-07-01.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

var Request = Class.create({

	implement: Event.Customs,

	options: {
		encoding: 		'utf-8',
		async: 				true,
		method: 			'post',
		headers: 			{},
		urlEncoded: 	true,
		url: 					'',
		data: 				'',
		link: 				'ignore',
		sanitizeJSON: false,
		evalJSON:     true,
		stripScripts: false,
		evalScripts: 	false,
    evalResponse: false
	},

	events: ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'],

	getXHR: function(){
		return (window.XMLHttpRequest) ? new XMLHttpRequest() : ((window.ActiveXObject) ? new ActiveXObject('Microsoft.XMLHTTP') : false);
	},

	initialize: function(options) {
		if (!(this.xhr = this.getXHR())) return;
		Object.extend(this.options, options || {});
		this.options.method = this.options.method.toLowerCase();
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = $H({});
	},

	check: function() {
		if (!this._running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
		}
		return false;
	},

	setHeader: function(name, value){
		this.headers.set(name, value);
		return this;
	},

	getHeader: function(name){
		return $try(function(){
			return this.getResponseHeader(name);
		}, this.xhr) || null;
	},

	send: function(options) {
		if (!this.check(options)) return this;
		this._running = true;

		var type = $type(options);
		if (type == 'string' || type == 'element') options = {data: options};

		options = Object.extend(this.options, options);
		var data = options.data;
		this.url = options.url;
		this.method = options.method;

		switch($type(data)){
			case 'element': data = $(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		// 处理put、delete等http method
		if (!['get', 'post'].include(this.method)) {
			var _method = '_method=' + this.method;
			data = (data) ? _method + '&' + data : _method;
			this.method = 'post';
		}
		this.data = this.options.data = data;
		data = null;

		if (this.data && this.method == 'get'){
			this.url += (this.url.include('?') ? '&' : '?') + this.data;
			this.data = null;
		}

		try {
			this.fireEvent('onCreate', [this]);
			this.xhr.open(this.method.toUpperCase(), this.url, this.options.async);

			this.xhr.onreadystatechange = this.onStateChange.bind(this);
			this.setRequestHeaders();

			this.fireEvent('onRequest', [this]);
			this.xhr.send(this.data);
			if (!this.options.async) this.onStateChange();
		} catch(e) {
			this.fireEvent('onException', [this, e]);
		}
		return this;
	},

	getStatus: function() {
    try {
      return this.xhr.status || 0;
    } catch (e) { return 0 }
  },

	isSuccess: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

	processScripts: function(response) {
		var text = response.responseText;
		if (this.options.evalResponse == 'force' || (/(ecma|java)script/).test(response.getHeader('Content-type'))) return $exec(text);
		if (this.options.evalScripts == 'force') text.evalScripts();
		if (this.options.stripScripts === true) return text.stripScripts();
		return text;
	},

	onStateChange: function() {
		var readyState = this.xhr.readyState;
    if (readyState > 1 && !((readyState == 4) && !this._running)) // readyState>1 并且不是 readyState==4和运行结束同时成立
      this.respondToReadyState(this.xhr.readyState);
	},

	respondToReadyState: function(readyState) {
		var state = this.state = this.events[readyState], response = new Response(this);
		if (state == 'Complete') {
			this._running = false;
			this.status = response.status;
			(this.options['on' + this.status] || JPlus.emptyFunction)(this, response, response.headerJSON);
			this.fireEvent('on' + this.status, [this, response, response.headerJSON]);
			var _result = this.options.isSuccess.call(this, this.status) ? 'Success' : 'Failure';
			(this.options['on' + _result] || JPlus.emptyFunction)(this, response, response.headerJSON);
			this.fireEvent('on' + _result, [this, response, response.headerJSON]);

			response.responseText = this.processScripts(response);
		}

		(this.options['on' + state] || JPlus.emptyFunction)(this, response, response.headerJSON);
		this.fireEvent('on' + state, [this, response, response.headerJSON]);

		if (state == 'Complete')
			this.xhr.onreadystatechange = JPlus.emptyFunction;
	},

	// 设置http头
	setRequestHeaders: function() {
		// this.headers = new Hash(this.options.headers).update({
		var headers = {
			'X-Requested-With': 'XMLHttpRequest',
			'X-JPlus-Version': JPlus.Version,
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		};

		if (this.options.urlEncoded && this.method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;

			/* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.xhr.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
		}

		this.headers.update($H(this.options.headers).update(headers));
		this.headers.each(function(pair) {
			try {
				this.xhr.setRequestHeader(pair.key, pair.value);
			} catch(e) {
				this.fireEvent('onException', [this, e, pair]);
			}
		}, this);
	},

	cancel: function() {
		if (!this._running) return this;
		this._running = false;
		this.xhr.abort();
		this.xhr.onreadystatechange = JPlus.emptyFunction;
		this.xhr = this.getXHR();
		this.fireEvent('onCancel', [this]);
		return this;
	}

});

var Response = Class.create({
	initialize: function(request){
    this.request = request;
    var xhr  = this.xhr  = request.xhr,
        readyState = this.readyState = xhr.readyState;

    if((readyState > 2 && !JPlus.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(xhr.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if(readyState == 4) {
      var xml = xhr.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,
  statusText: '',

  getStatus: Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.xhr.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.xhr.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.xhr.getAllResponseHeaders();
  },

	/*
		TODO 支持域检查
	*/
  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON);
    } catch (e) {
      this.request.fireEvent('onException', [e, this.request]);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON);
    } catch (e) {
      this.request.fireEvent('onException', [e, this.request]);
    }
  }
});

// alias
(function(){
var methods = {};
['get', 'post', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(){
		var params = Array.link(arguments, {url: String.type, data: false});
		return this.send(Object.extend(params, {method: method.toLowerCase()}));
	};
});

Object.extend(Request.prototype, methods);
})();

Element.Properties.send = {

	set: function(options){
		var send = this.retrieve('send');
		if (send) send.cancel();
		return this.eliminate('send').store('send:options', Object.extend({
			data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
		}, options));
	},

	get: function(options){
		if (options || !this.retrieve('send')){
			if (options || !this.retrieve('send:options')) this.set('send', options);
			this.store('send', new Request(this.retrieve('send:options')));s
		}
		return this.retrieve('send');
	}

};

Element.addMethods({

	send: function(element, url){
		element = $(element);
		var sender = element.get('send');
		sender.send({data: element, url: url || sender.options.url});
		return element;
	}

});