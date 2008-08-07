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
	
	version: '0.2',
	
	implement: Event.Customs,
	
	options: {
		wrapper: null
	},
	
	days_of_month: [31,28,31,30,31,30,31,31,30,31,30,31],
	
	containers: [],
	
	defaultc: null,
	
	on_days_line: false,
	
	onmouse_start: 0,
	
	onmouse_end: 0,
	
	selected_cache: {},
	
	gray_cache: {},
	
	available_cache: {},
	
	mode: {},	// 0: normal mode, 1: available mode
	
	status: {},
	
	dump_to: {},
	
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
				this.mode[div.id] = 0;
				this.status[div.id] = {};
				this.selected_cache[div.id] = {};
				this.gray_cache[div.id] = {};
				this.available_cache[div.id] = {};
				this.dump_to[div.id] = {};
				this.set_attribute_cache(div.get('gray'), div.id, 'gray');
				this.set_attribute_cache(div.get('available'), div.id, 'available');
				this.load_status(div.get('status'), div.id);
				this.set_dump(div.get('dump_to'), div.id);
				this.containers.push(div);
			}
		}, this);
	},
	
	set_dump: function(dump, key) {
		if (!dump) return;
		this.dump_to[key] = $(dump);
	},
	
	load_status: function(status, key) {
		if (!status) return;
		status = new Hash(status.evalJSON());
		status.each(function(pair) {
			var _cache;
			eval("_cache = this." + pair.key + '_cache');
			if (!_cache) eval("this." + pair.key + "_cache = {};_cache = this." + pair.key + "_cache;");
			if (!_cache[key]) _cache[key] = {};
			this.set_attribute_cache(pair.value.period, key, pair.key);
			this.status[key][pair.key] = pair.value;
		}, this);
		
		// alert(Object.inspect(new Hash(this.status[key])));
		// alert(new Hash(this.status2_cache[key]).inspect());
	},
	
	set_attribute_cache: function(gray, key, attr) {
		if (!gray) return;
		var _gray = gray.split(';');
		_gray.each(function(period) {
			var _period = period.split('~'), _subkey = '', _value, _cache;
			if (_period.length > 1) {
				var _first = _period.first(), __first = _first.split('-'), _start = __first[2].to_i(), _end = _period.last().split('-')[2].to_i();
				_subkey = __first.slice(0, 2).join('-');
				_value = $R(_start, _end).toArray();
			} else {
				var __period = period.split('-');
				_subkey = __period.slice(0, 2).join('-');
				_value = [__period[2].to_i()];
			}
			eval('_cache = this.' + attr + '_cache');
			if (!_cache[key][_subkey]) _cache[key][_subkey] = [];
			_cache[key][_subkey] = _cache[key][_subkey].concat(_value);
		}, this);
		
		if (attr == 'available') this.mode[key] = 1;
	},
	
	is_status: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day;
		month = month || this.month;
		year = year || this.year;
		
		var _status = new Hash(this.status[container.id]);
		var _result = [false, null];
		_status.each(function(pair) {
			var _cache;
			eval("_cache = this." + pair.key + "_cache");
			if (_cache[container.id][year + '-' + month.toPaddedString(2)]) {
				if (_cache[container.id][year + '-' + month.toPaddedString(2)].include(day)) {
					_result = [true, pair.value.color];
					return;
				}
			}
		}, this);
		
		// alert(_result.inspect());
		
		return _result;
	},
	
	is_available: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day;
		month = month || this.month;
		year = year || this.year;
		
		if (this.available_cache[container.id][year + '-' + month.toPaddedString(2)])
			return this.available_cache[container.id][year + '-' + month.toPaddedString(2)].include(day);
		else
			return false;
	},
	
	is_gray: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day;
		month = month || this.month;
		year = year || this.year;
		
		if (this.gray_cache[container.id][year + '-' + month.toPaddedString(2)])
			return this.gray_cache[container.id][year + '-' + month.toPaddedString(2)].include(day);
		else
			return false;
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
	
	is_saled: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day;
		month = month || this.month;
		year = year || this.year;
		
		if (this.mode[container.id] == 0) {
			return this.is_gray(day, month, year, container);
		} else {
			return !this.is_available(day, month, year, container);
		}
	},
	
	day_status: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day;
		month = month || this.month;
		year = year || this.year;
		
		var _status = this.is_status(day, month, year, container);
		if (_status[0])
			return ' style="background-color: ' + _status[1] + '"';
		else
			return '';
	},
	
	create: function() {
		this.before_create();
		var _days = this.get_month_days(this.month-1);
		var _html = '<table class="dcalendar" border="0" cellspacing="1" cellpadding="4"><tbody><tr class="dcal-title"><td colspan="3"><a href="#" id="' + this.defaultc.id + '_prev">上一月</a></td><td colspan="' + (_days-6) + '">' + this.curr_day.strftime('%Y年%m月') + '</td><td colspan="3"><a href="#" id="' + this.defaultc.id + '_next">下一月</a></td></tr><tr class="dcal-days" id="' + this.defaultc.id + '_days">';
		_days.times(function(i) {
			_html += '<td id="' + this.defaultc.id + '_days_' + (i + 1) + '"' + (this.is_saled(i+1, this.month, this.year) ? ' class="saled"' : this.day_status(i+1, this.month, this.year)) + '>' + (i + 1) + '</td>';
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
			td = $(td);
			td.observe('click', function(e) {
				if (this.className == 'saled') return;
				var defaultc = $(this.id.split('_').slice(0, 2).join('_'));
				_dcal.defaultc = defaultc;
				this.className = this.className == 'selected' ? '' : 'selected';
				_dcal.set_cache();
				_dcal.refresh_selected();
			});
			
			td.observe('mouseover', function(e) {
				if (!_dcal.on_days_line) return;
				if (this.className != 'selected' && this.className != 'saled') this.className = this.className == 'mouseover' ? '' : 'mouseover';
			});
		});
		
		days_line.observe('mousedown', function(e) {
			var target = e.target;
			_dcal.on_days_line = true;
			if (target.get('tag') == 'td') {
				_dcal.defaultc = $(target.id.split('_').slice(0, 2).join('_'));
				if (target.className != 'saled') target.className = target.className == 'selected' ? '' : 'selected';
				_dcal.onmouse_start = parseInt(target.innerHTML);
			}
		});
		
		days_line.observe('mouseup', function(e) {
			var target = e.target;
			_dcal.on_days_line = false;
			if (target.get('tag') == 'td') {
				if (target.className != 'saled') target.className = target.className == 'selected' ? '' : 'selected';
				var _end = parseInt(target.innerHTML);
				if (_end < _dcal.onmouse_start) {
					_dcal.onmouse_end = _dcal.onmouse_start;
					_dcal.onmouse_start = _end;
				} else {
					_dcal.onmouse_end = _end;
				}
			}
			
			for (var i = _dcal.onmouse_start+1; i <= _dcal.onmouse_end-1; i++) {
				var _td = $i(_dcal.defaultc.id + '_days_' + i);
				if (_td.className != 'saled') _td.className = _td.className == 'selected' ? '' : 'selected';
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
		this.dump();
	},
	
	dump: function(container) {
		container = container || this.defaultc;
		var _months = new Hash(this.selected_cache[container.id]), _result = '';
		_months.each(function(pair) {
			var _formated = this.format_cache(pair.value);
			if (_formated != '') {
				_result += _result == '' ? _formated : ',' + _formated;
			}
		}, this);
		
		try {
			this.dump_to[container.id].value = _result;
		} catch(e) {}
	},
	
	format_cache: function(cache, is_append) {
		is_append = is_append || true;
		if (!$defined(cache)) return;
		var _start = '', _end = '', _days = cache.length, _sel_wrapper = $i(this.defaultc.id + '_selected'), _result = '';
		_sel_wrapper.innerHTML = '';
		(_days).times(function(i) {
			if (cache.charAt(i) == '1') {
				var _the_day = this.year + '-' + this.month.toPaddedString(2) + '-' + (i + 1).toPaddedString(2);
				$i(this.defaultc.id + '_days_' + (i + 1)).className = 'selected';
				if (_start == '') {
					_start = _the_day;
				} else {
					_end = _the_day;
				}
				if (i == (_days - 1)) {
					if (_start != '' && is_append) _sel_wrapper.appendChild(this.selected_item(_start, _end));
				}
				_result += _result == '' ? _the_day : ',' + _the_day;
			} else {
				_end = this.year + '-' + this.month.toPaddedString(2) + '-' + (i).toPaddedString(2)
				if (_start != '' && is_append) _sel_wrapper.appendChild(this.selected_item(_start, _end));
				_start = '';
				_end = '';
			}
		}, this);
		
		return _result;
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

document.onselectstart = function(event) {return false};

document.observe('dom:ready', function() {
	var dcal = new DCalendar.core({wrapper: $('main')});
	dcal.show();
});