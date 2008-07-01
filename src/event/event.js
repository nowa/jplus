//
//  事件类实现，支持自定义事件
//  JPlus -> event.js
//
//  Created by nowa on 2008-06-23.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

var Event = window.Event || {};

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
		args = options.event ? [options.event].concat($A(args)) : args;
		this._events[type].each(function(fn) {
			var _call = function() { return fn.apply(options.bind, args) };
			if (options.delay) 
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