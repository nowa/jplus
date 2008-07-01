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
  loaded:        false
});

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb, 
     Matthias Miller, Dean Edwards and John Resig. */

  var timer;
  
  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearInterval(timer);
    document.fire("dom:loaded");
    document.loaded = true;
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