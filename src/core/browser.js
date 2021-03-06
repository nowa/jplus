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