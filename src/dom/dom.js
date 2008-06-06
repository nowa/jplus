/**
 * DOM相关
 */ 

/**
 * 根据id获取html element
 *
 * @author from Prototype1.6
 * @method $
 * @param {object} 参数可以是Array也可以是String
 * @return {object} 如果参数是Array，那么返回值也是一个element数组；如果参数是String，返回值是element object
 */
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

// element constructor
var Element = window.Element || {};



Element.extend = function() {
	
};