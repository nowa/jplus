/**
 * 基础方法及类库
 */

// 为Object对象添加继承方法
Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

// 向Object添加自定义方法
Object.extend(Object, {
	
	/**
	 * 检查对象是否是String
	 *
	 * @author from Prototype1.6
	 * @method isString
	 * @param {Object} object
	 * @return {Bool} true or false
	 */
	isString: function(object) {
	  return typeof object == "string";
	}
	
});