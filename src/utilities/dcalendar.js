// 
//  支持拖动选择的横向日历
//  JPlus -> dcalendar.js
//  
//  Created by nowa on 2008-07-17.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

var DCalendar = {
	DCID: 0
};

DCalendar.core = Class.create({
	
	implement: Event.Customs,
	
	options: {
		autoshow: true,
		showfix: false,
		wrapper: null
	},
	
	days_of_month: [31,28,31,30,31,30,31,31,30,31,30,31],
	
	containers: [],
	
	defaultc: null,
	
	on_days_line: false,
	
	onmouse_start: 0,
	
	onmouse_end: 0,
	
	initialize: function(options) {
		this.options = Object.extend(this.options, options || {});
		this.today = Date.now();
		this.year = this.today.year();
		this.month = this.today.month();
		this.day =  this.today.day();
		
		var _wrapper = this.options.wrapper ? this.options.wrapper : document;
		var divs = _wrapper.getElementsByTagName('div');
		$A(divs).each(function(div) {
			if (div.getAttribute('jpc') == 'dcalendar') {
				div = $(div);
				div.set('DCID', div.get('DCID') || DCalendar.DCID++);
				div.id = 'dcid_' + div.get('DCID');
				this.containers.push(div);
			}
		}, this);
	},
	
	show: function() {
		this.containers.each(function(cal) {
			this.defaultc = cal;
			this.options = Object.extend(this.options, cal.get('options') || {});
			this.create();
		}, this);
	},
	
	before_create: function() {
		this.fireEvent('beforeCreate');
	},
	
	create: function() {
		this.before_create();
		var _days = this.get_month_days(this.month-1);
		var _html = '<table class="dcalendar" border="0" cellspacing="1" cellpadding="4"><tbody><tr class="dcal-title"><td colspan="' + _days + '">' + this.today.strftime('%Y年%m月') + '</td></tr><tr class="dcal-days" id="' + this.defaultc.id + '_days">';
		_days.times(function(i) {
			_html += '<td>' + (i + 1) + '</td>';
		});
		_html += '</tr></tbody></table>';
		this.defaultc.innerHTML = _html;
		
		this.enabled();
	},
	
	enabled: function() {
		var days_line = $(this.defaultc.id + '_days');
		this.on_days_line = false;
		this.onmouse_start = 0;
		this.onmouse_end = 0;
		
		var _dcal = this, _tds = days_line.getElementsByTagName('td');
		$A(_tds).each(function(td) {
			td.observe('click', function(e) {
				this.className = this.className == 'selected' ? '' : 'selected';
				_dcal.refresh_selected(this.parentNode.parentNode.parentNode.parentNode);
			})
		});
	},
	
	refresh_selected: function(container) {
		
	},
	
	get_month_days: function(month) {
		var _days = this.days_of_month[month];
		if (month==1 && (year%4==0 && year%100!=0 || year%400==0)) _days++;
		return _days;
	}
	
});

document.observe('dom:ready', function() {
	var dcal = new DCalendar.core({wrapper: $('main')});
	dcal.show();
});