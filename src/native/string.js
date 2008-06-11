/**
 * 对String的扩展，以及相关方法
 */

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
	 * @author based on Prototype1.6->String.prototype.gsub
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
				result += _replacement(match);
				source = source.slice(match.index + match[0].length);
			} else {
				result += source; source = '';
			}
		}
		
		return result;
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