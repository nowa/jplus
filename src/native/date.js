// 
//  对Date对象的扩展
//  JPlus -> date.js
//  
//  Created by nowa on 2008-06-19.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
//

Object.extend(Date, {
	
	now: function() {
		return new Date();
	},
	
	formats: {
		'%a': 'shortWeekday',
		'%A': 'longWeekday',
		'%b': 'shortMonthName',
		'%B': 'monthName',
		'%d': 'day',
		'%y': 'shortYear',
		'%Y': 'year',
		'%m': 'month',
		'%M': 'minute',
		'%H': 'hour',
		'%I': 'ihour',
		'%S': 'second',
		'%p': 'mindicator',
		'%w': 'weekday'
	}
	
}); 

Object.extend(Date.prototype, {
	
	year: Date.prototype.getFullYear,
	day: Date.prototype.getDate,
	hour: Date.prototype.getHours,
	minute: Date.prototype.getMinutes,
	second: Date.prototype.getSeconds,
	msecond: Date.prototype.getMilliseconds,
	weekday: Date.prototype.getDay,
	
	month: function() {
		return this.getMonth() + 1;
	},
	
	shortWeekday: function() {
		return String.weekday.short[this.weekday()];
	},
	
	longWeekday: function() {
		return String.weekday.long[this.weekday()];
	},
	
	shortMonthName: function() {
		return String.month.short[this.getMonth()];
	},
	
	monthName: function() {
		return String.month.long[this.getMonth()];
	},
	
	shortYear: function() {
		return this.year().toString().slice(2);
	},
	
	ihour: function() {
		var __hour = this.hour();
		return __hour > 12 ? __hour - 12 : __hour;
	},
	
	mindicator: function() {
		return this.hour() > 12 ? 'PM' : 'AM';
	},
	
	strftime: function(format) {
		var match, format = format.replace('\\%', '{PER}');
		if (match = format.match(/(\%[\w\%]{1})/ig)) {
			match.each(function(value) {
				try {
					format = format.gsub(value, eval('this.' + Date.formats[value] + '()'));
				} catch(e) {
					throw new SyntaxError('Badly format string: ' + format.inspect());
				}
			}, this);
		}
		return format.gsub('{PER}', '%');
	},
	
	after: function(format, offset) {
		var _c = this.clone();
		eval('_c.set' + format + '(_c.get' + format + '() + ' + offset + ')');
		return _c;
	},
	
	clone: function() {
		return new Date(this.year(), this.getMonth(), this.day(), this.hour(), this.minute(), this.second(), this.msecond());
	},
	
	inspect: function() {
		return "'" + this.toString() + "'";
	},
	
	toJSON: function() {
		return this.inspect();
	}
	
});