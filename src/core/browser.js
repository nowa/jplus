/**
 * 浏览器相关
 */

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