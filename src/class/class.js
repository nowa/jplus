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

		['implements'].each(function(prop) {
			if (!this[prop]) return;
			Class[prop](this, this[prop]);
			delete this[prop];
		}, klass.prototype);

		klass.prototype.constructor = klass;
		return klass;
	},
	
	implements: function(self, klasses) {
		$A(klasses).each(function(k) {
			Object.extend(self, (typeof k).toLowerCase() == 'function' ? new k(JPlus.k) : k);
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