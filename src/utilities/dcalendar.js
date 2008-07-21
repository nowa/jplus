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
	
	selected_cache: {},
	
	initialize: function(options) {
		this.options = Object.extend(this.options, options || {});
		this.curr_day = Date.now();
		this.year = this.curr_day.year();
		this.month = this.curr_day.month();
		this.day =  this.curr_day.day();
		
		var _wrapper = this.options.wrapper ? this.options.wrapper : document;
		var divs = _wrapper.getElementsByTagName('div');
		$A(divs).each(function(div) {
			if (div.getAttribute('jpc') == 'dcalendar') {
				div = $(div);
				div.setAttribute('DCID', div.get('DCID') || DCalendar.DCID++);
				div.id = 'dcid_' + div.get('DCID');
				this.selected_cache[div.id] = {};
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
	
	change_to_date: function(date) {
		this.fireEvent('onMonthChange');
		this.curr_day = date;
		this.year = this.curr_day.year();
		this.month = this.curr_day.month();
		this.day =  this.curr_day.day();
		this.create();
		this.refresh_selected();
	},
	
	set_default: function(d) {
		this.defaultc = d;
	},
	
	before_create: function() {
		this.fireEvent('beforeCreate');
	},
	
	create: function() {
		this.before_create();
		var _days = this.get_month_days(this.month-1);
		var _html = '<table class="dcalendar" border="0" cellspacing="1" cellpadding="4"><tbody><tr class="dcal-title"><td colspan="3"><a href="#" id="' + this.defaultc.id + '_prev">上一月</a></td><td colspan="' + (_days-6) + '">' + this.curr_day.strftime('%Y年%m月') + '</td><td colspan="3"><a href="#" id="' + this.defaultc.id + '_next">下一月</a></td></tr><tr class="dcal-days" id="' + this.defaultc.id + '_days">';
		_days.times(function(i) {
			_html += '<td id="' + this.defaultc.id + '_days_' + (i + 1) + '">' + (i + 1) + '</td>';
		}, this);
		_html += '</tr></tbody></table><div id="' + this.defaultc.id + '_selected" class="dcal-selected"></div>';
		this.defaultc.innerHTML = _html;
		
		this.enabled();
	},
	
	enabled: function() {
		var _dcal = this, days_line = $(this.defaultc.id + '_days'), prev = $(this.defaultc.id + '_prev'), next = $(this.defaultc.id + '_next');
		this.on_days_line = false;
		this.onmouse_start = 0;
		this.onmouse_end = 0;
		
		prev.observe('click', function(e) {
			_dcal.set_default($(this.id.split('_').slice(0, 2).join('_')));
			_dcal.change_to_date(_dcal.curr_day.after('Month', -1));
			return false;
		});
		
		next.observe('click', function(e) {
			_dcal.set_default($(this.id.split('_').slice(0, 2).join('_')));
			_dcal.change_to_date(_dcal.curr_day.after('Month', 1));
			return false;
		});
		
		var _tds = days_line.getElementsByTagName('td');
		$A(_tds).each(function(td) {
			$(td).observe('click', function(e) {
				var defaultc = $(this.id.split('_').slice(0, 2).join('_'));
				_dcal.defaultc = defaultc;
				this.className = this.className == 'selected' ? '' : 'selected';
				_dcal.set_cache();
				_dcal.refresh_selected();
			})
		});
		
		days_line.observe('mousedown', function(e) {
			var target = e.target;
			_dcal.on_days_line = true;
			if (target.get('tag') == 'td') {
				_dcal.defaultc = $(target.id.split('_').slice(0, 2).join('_'));
				target.className = target.className == 'selected' ? '' : 'selected';
				_dcal.onmouse_start = parseInt(target.innerHTML);
			}
		});
		
		days_line.observe('mouseup', function(e) {
			var target = e.target;
			_dcal.on_days_line = false;
			if (target.get('tag') == 'td') {
				target.className = target.className == 'selected' ? '' : 'selected';
				var _end = parseInt(target.innerHTML);
				if (_end < _dcal.onmouse_start) {
					_dcal.onmouse_end = _dcal.onmouse_start;
					_dcal.onmouse_start = _end;
				} else {
					_dcal.onmouse_end = _end;
				}
			}
			
			for (var i = _dcal.onmouse_start+1; i <= _dcal.onmouse_end-1; i++) {
				var _td = $(_dcal.defaultc.id + '_days_' + i);
				_td.className = _td.className == 'selected' ? '' : 'selected';
			}
			_dcal.set_cache();
			_dcal.refresh_selected();
		});
	},
	
	refresh_selected: function(container) {
		container = container || this.defaultc;
		this.format_cache(this.selected_cache[container.id][this.year + '-' + this.month]);
	},
	
	set_cache: function(container) {
		container = container || this.defaultc;
		var days_line = $(this.defaultc.id + '_days'), _tds = days_line.getElementsByTagName('td'), _selected = '';
		$A(_tds).each(function(td) {
			_selected += td.className == 'selected' ? '1' : '0';
		});
		
		this.selected_cache[container.id][this.year + '-' + this.month] = _selected;
	},
	
	format_cache: function(cache) {
		if (!$defined(cache)) return;
		var _start = '', _end = '', _days = cache.length, _sel_wrapper = $i(this.defaultc.id + '_selected');
		_sel_wrapper.innerHTML = '';
		(_days).times(function(i) {
			if (cache.charAt(i) == '1') {
				$i(this.defaultc.id + '_days_' + (i + 1)).className = 'selected';
				if (_start == '') {
					_start = this.year + '-' + this.month.toPaddedString(2) + '-' + (i + 1).toPaddedString(2);
				} else {
					_end = this.year + '-' + this.month.toPaddedString(2) + '-' + (i + 1).toPaddedString(2);
				}
				if (i == (_days - 1)) {
					if (_start != '') _sel_wrapper.appendChild(this.selected_item(_start, _end));
				}
			} else {
				_end = this.year + '-' + this.month.toPaddedString(2) + '-' + (i).toPaddedString(2)
				if (_start != '') _sel_wrapper.appendChild(this.selected_item(_start, _end));
				_start = '';
				_end = '';
			}
		}, this);
	},
	
	selected_item: function(start, end) {
		var _child = document.createElement('li');
		_child.innerHTML = start + (end == '' || end == start ? '' : ' ~ ' + end);
		return _child;
	},
	
	get_month_days: function(month) {
		var _days = this.days_of_month[month];
		if (month==1 && (this.year%4==0 && this.year%100!=0 || this.year%400==0)) _days++;
		return _days;
	}
	
});

document.onselectstart= function(event) {return false};

document.observe('dom:ready', function() {
	var dcal = new DCalendar.core({wrapper: $('main')});
	dcal.show();
});