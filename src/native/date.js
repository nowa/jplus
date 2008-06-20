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
		'%A': 'weekday',
		'%b': 'shortMonthName',
		'%B': 'monthName'
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
	
	strftime: function() {
		
	}
	
});