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