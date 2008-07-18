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