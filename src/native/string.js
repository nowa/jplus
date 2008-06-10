/**
 * 对String的扩展，以及相关方法
 */

String.prototype._split = String.prototype.split;

Object.extend(String.prototype, {
	
	strip: function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	
	split: function(separator, limit) {
		if (!separator) return this;
		return this.strip()._split(separator, limit);
	}
	
});