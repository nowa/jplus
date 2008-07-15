//include 'HEADER'

var JPlus = {
	Version: '<%= JPLUS_VERSION %>',
	
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