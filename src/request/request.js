// 
//  使用XMLHTTPRequest实现完整的http请求
//  JPlus -> request.js
//  
//  Created by nowa on 2008-07-01.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

var Request = Class.create({

	implement: [Event.Custom],

	options: {
		encoding: 		'utf-8',
		async: 				true,
		method: 			'post',
		headers: 			{},
		contentType:  'application/x-www-form-urlencoded',
		parameters:   '',
		url: 					'',
		data: 				'',
		link: 				'ignore',
		evalJSON:     true,
    evalJS:       true
	},

	getXHR: function(){
		return (window.XMLHttpRequest) ? new XMLHttpRequest() : ((window.ActiveXObject) ? new ActiveXObject('Microsoft.XMLHTTP') : false);
	},

	initialize: function(options) {
		if (!(this.xhr = this.getXHR())) return;
		Object.extend(this.options, options || {});
		this.options.method = this.options.method.toLowerCase();
		
		if (Object.isString(this.options.parameters))
			this.options.parameters = this.options.parameters.toQueryParams();
		else if (Object.isHash(this.options.parameters))
			this.options.parameters = this.options.parameters.toObject();
		
		this.headers = new Hash(this.options.headers).update({
			'X-Requested-With': 'XMLHttpRequest',
			'X-JPlus-Version': JPlus.Version,
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		});
	},
	
	check: function() {
		if (!this._running) return true;
		return false;
	},
	
	send: function(options) {
		if (!this.check(options)) return this;
		this._running = true;
		
		this.url = this.options.url;
		this.method = this.options.method;
		
		if (Object.isString(options) || Object.isElement(options)) options = {data: options};
		Object.extend(this.options, options || {});
		
		var data = this.options.data;
		if (Object.isElement(data))
			data = $(data).toQueryString();
		else if (Object.isHash(data))
			data = data.toQueryString();
		
		var params = Object.clone(this.options.parameters);
		
		// 处理put、delete等http method
		if (!['get', 'post'].include(this.method)) {
			params['_method'] = this.method;
			this.method = 'post';
		}
		this.parameters = params;
	},
	
	cancel: function() {
		this.fireEvent('onCancel');
	}

});