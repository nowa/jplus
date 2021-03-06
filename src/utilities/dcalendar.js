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
	
	accessor: {},
	
	unaccessor: ["saled"],
	
	initialize: function(options) {
		this.options = Object.extend(this.options, options || {});
		this.curr_day = {};
		this.year = {};
		this.month = {};
		this.day = {};
		
		var _wrapper = this.options.wrapper ? this.options.wrapper : document;
		var divs = _wrapper.getElementsByTagName('div');
		$A(divs).each(function(div) {
			if (div.getAttribute('jpc') == 'dcalendar') {
				div = $(div);
				div.setAttribute('DCID', div.get('DCID') || DCalendar.DCID++);
				div.id = 'dcid_' + div.get('DCID');
				
				this.curr_day[div.id] = Date.now();
				this.year[div.id] = this.curr_day[div.id].year();
				this.month[div.id] = this.curr_day[div.id].month();
				this.day[div.id] = this.curr_day[div.id].day();
				
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
				this.accessor[div.id] = div.get('accessor') || 'all';
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
			if (pair.value['accessor']) {
				// alert(pair.value['accessor']);
				if (pair.value['accessor'] == 'false') this.unaccessor.push(pair.key);
			}
		}, this);
		
		// alert(this.unaccessor.inspect());
		// alert(Object.inspect(new Hash(this.status[key])));
		// alert(new Hash(this.status2_cache[key]).inspect());
	},
	
	format_period: function(period) {
		if (!period) return;
		var periods = period.split(';');
		return periods.inject([], function(result, p) {
			if (p.include('~')) {
				var _splited = p.split('~');
				var _start = _splited[0].to_date(), _end = _splited[1].to_date();
				if (_end.month() > _start.month() || _end.year() > _start.year()) {
					result.push(_splited[0] + '~' + _start.year() + '-' + _start.month() + '-' + this.days_of_month[_start.getMonth()]);
					var point = _start.after('Month', 1);
					while (point < (_end.year() + '-' + _end.month() + '-1').to_date()) {
						result.push(point.year() + '-' + point.month().toPaddedString(2) + '-01~' + point.year() + '-' + point.month().toPaddedString(2) + '-' + this.days_of_month[point.getMonth()]);
						point = point.after('Month', 1);
					}
					result.push(_end.year() + '-' + _end.month().toPaddedString(2) + '-01~' + _splited[1]);
				} else {
					result.push(p);
				}
			} else {
				result.push(p);
			}
			return result;
		}, this);
	},
	
	set_attribute_cache: function(gray, key, attr) {
		if (!gray) return;
		var _gray = this.format_period(gray);
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
		day = day || this.day[container.id];
		month = month || this.month[container.id];
		year = year || this.year[container.id];
		
		var _status = new Hash(this.status[container.id]);
		var _result = [false, null];
		_status.each(function(pair) {
			var _cache;
			eval("_cache = this." + pair.key + "_cache");
			if (_cache[container.id][year + '-' + month.toPaddedString(2)]) {
				if (_cache[container.id][year + '-' + month.toPaddedString(2)].include(day)) {
					_result = [true, pair.value.color, pair.key];
					return;
				}
			}
		}, this);
		
		// alert(_result.inspect());
		
		return _result;
	},
	
	is_available: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day[container.id];
		month = month || this.month[container.id];
		year = year || this.year[container.id];
		
		if (this.available_cache[container.id][year + '-' + month.toPaddedString(2)])
			return this.available_cache[container.id][year + '-' + month.toPaddedString(2)].include(day);
		else
			return false;
	},
	
	is_gray: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day[container.id];
		month = month || this.month[container.id];
		year = year || this.year[container.id];
		
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
		this.curr_day[this.defaultc.id] = date;
		this.year[this.defaultc.id] = this.curr_day[this.defaultc.id].year();
		this.month[this.defaultc.id] = this.curr_day[this.defaultc.id].month();
		this.day[this.defaultc.id] =  this.curr_day[this.defaultc.id].day();
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
		day = day || this.day[container.id];
		month = month || this.month[container.id];
		year = year || this.year[container.id];
		
		if (this.mode[container.id] == 0) {
			return this.is_gray(day, month, year, container);
		} else {
			return !this.is_available(day, month, year, container);
		}
	},
	
	day_status: function(day, month, year, container) {
		container = container || this.defaultc;
		day = day || this.day[container.id];
		month = month || this.month[container.id];
		year = year || this.year[container.id];
		
		var _status = this.is_status(day, month, year, container);
		if (_status[0])
			return ' style="background-color: ' + _status[1] + '"';
		else
			return '';
	},
	
	create: function() {
		this.before_create();
		var _days = this.get_month_days(this.month[this.defaultc.id]-1);
		var _html = '<table class="dcalendar" border="0" cellspacing="1" cellpadding="4"><tbody><tr class="dcal-title"><td colspan="3"><a href="#" id="' + this.defaultc.id + '_prev">上一月</a></td><td colspan="' + (_days-6) + '">' + this.curr_day[this.defaultc.id].strftime('%Y年%m月') + '</td><td colspan="3"><a href="#" id="' + this.defaultc.id + '_next">下一月</a></td></tr><tr class="dcal-days" id="' + this.defaultc.id + '_days">';
		_days.times(function(i) {
			var _is_status = this.is_status(i+1, this.month[this.defaultc.id], this.year[this.defaultc.id]);
			_html += '<td st="' + (this.is_saled(i+1, this.month[this.defaultc.id], this.year[this.defaultc.id]) ? 'saled' : (_is_status[0] ? _is_status[2] + '" realst="' + _is_status[2] : 'available')) + '" id="' + this.defaultc.id + '_days_' + (i + 1) + '"' + (this.is_saled(i+1, this.month[this.defaultc.id], this.year[this.defaultc.id]) ? ' class="saled"' : this.day_status(i+1, this.month[this.defaultc.id], this.year[this.defaultc.id])) + '>' + (i + 1) + '</td>';
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
			_dcal.change_to_date(_dcal.curr_day[_dcal.defaultc.id].after('Month', -1));
			return false;
		});
		
		next.observe('click', function(e) {
			_dcal.set_default($(this.id.split('_').slice(0, 2).join('_')));
			_dcal.change_to_date(_dcal.curr_day[_dcal.defaultc.id].after('Month', 1));
			return false;
		});
		
		if (this.accessor[this.defaultc.id] == 'readonly') return;
		
		var _tds = days_line.getElementsByTagName('td');
		$A(_tds).each(function(td) {
			td = $(td);
			td.observe('click', function(e) {
				if (_dcal.unaccessor.include(this.get('st'))) return;
				var defaultc = $(this.id.split('_').slice(0, 2).join('_'));
				_dcal.defaultc = defaultc;
				this.className = this.className == 'selected' ? '' : 'selected';
				this.setAttribute('st', this.className == '' ? this.get('realst') ? this.get('realst') : 'available' : this.className);
				_dcal.set_cache();
				_dcal.refresh_selected();
			});
			
			td.observe('mouseover', function(e) {
				if (!_dcal.on_days_line) return;
				if (!_dcal.unaccessor.concat(['selected']).include(this.get('st'))) this.className = this.className == 'mouseover' ? '' : 'mouseover';
				this.setAttribute('st', this.className == '' ? this.get('realst') ? this.get('realst') : 'available' : this.className);
			});
		});
		
		days_line.observe('mousedown', function(e) {
			var target = e.target;
			_dcal.on_days_line = true;
			if (target.get('tag') == 'td') {
				_dcal.defaultc = $(target.id.split('_').slice(0, 2).join('_'));
				if (!_dcal.unaccessor.include(target.get('st'))) target.className = target.className == 'selected' ? '' : 'selected';
				target.setAttribute('st', target.className == '' ? target.get('realst') ? target.get('realst') : 'available' : target.className);
				_dcal.onmouse_start = parseInt(target.innerHTML);
			}
		});
		
		days_line.observe('mouseup', function(e) {
			var target = e.target;
			_dcal.on_days_line = false;
			if (target.get('tag') == 'td') {
				if (!_dcal.unaccessor.include(target.get('st'))) target.className = target.className == 'selected' ? '' : 'selected';
				target.setAttribute('st', target.className == '' ? target.get('realst') ? target.get('realst') : 'available' : target.className);
				var _end = parseInt(target.innerHTML);
				// if (_end = _dcal.onmouse_start) return;
				if (_end < _dcal.onmouse_start) {
					_dcal.onmouse_end = _dcal.onmouse_start;
					_dcal.onmouse_start = _end;
				} else {
					_dcal.onmouse_end = _end;
				}
			}
			
			for (var i = _dcal.onmouse_start+1; i <= _dcal.onmouse_end-1; i++) {
				var _td = $i(_dcal.defaultc.id + '_days_' + i);
				if (!_dcal.unaccessor.include(_td.getAttribute('st'))) _td.className = _td.className == 'selected' ? '' : 'selected';
				_td.setAttribute('st', _td.className == '' ? _td.getAttribute('realst') ? _td.getAttribute('realst') : 'available' : _td.className);
			}
			_dcal.set_cache();
			_dcal.refresh_selected();
		});
	},
	
	refresh_selected: function(container) {
		container = container || this.defaultc;
		this.format_cache(this.selected_cache[container.id][this.year[container.id] + '-' + this.month[container.id]]);
	},
	
	set_cache: function(container) {
		container = container || this.defaultc;
		var _days = this.days_of_month[this.month[container.id]-1], _selected = '';
		(_days).times(function(i) {
			var _td = $i(this.defaultc.id + '_days_' + (i + 1));
			_selected += _td.className == 'selected' ? '1' : '0';
		}, this);
		this.selected_cache[container.id][this.year[container.id] + '-' + this.month[container.id]] = _selected;
		this.dump();
	},
	
	dump: function(container) {
		container = container || this.defaultc;
		var _months = new Hash(this.selected_cache[container.id]), _result = '';
		_months.each(function(pair) {
			var _date = pair.key.split('-');
			var _formated = this.format_cache(pair.value, _date[0].to_i(), _date[1].to_i(), false);
			if (_formated != '') {
				_result += _result == '' ? _formated : ',' + _formated;
			}
		}, this);
		
		try {
			this.dump_to[container.id].value = _result;
		} catch(e) {}
	},
	
	format_cache: function(cache, year, month, is_append) {
		is_append = is_append || true;
		year = year || this.year[this.defaultc.id];
		month = month || this.month[this.defaultc.id];
		if (!$defined(cache)) return;
		var _start = '', _end = '', _days = cache.length, _sel_wrapper = $i(this.defaultc.id + '_selected'), _result = '';
		_sel_wrapper.innerHTML = '';
		(_days).times(function(i) {
			if (cache.charAt(i) == '1') {
				var _the_day = year + '-' + month.toPaddedString(2) + '-' + (i + 1).toPaddedString(2);
				if (is_append && month == this.month[this.defaultc.id]) $i(this.defaultc.id + '_days_' + (i + 1)).className = 'selected';
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
				_end = year + '-' + month.toPaddedString(2) + '-' + (i).toPaddedString(2)
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
		if (month==1 && (this.year[this.defaultc.id]%4==0 && this.year[this.defaultc.id]%100!=0 || this.year[this.defaultc.id]%400==0)) _days++;
		return _days;
	}
	
});

document.onselectstart = function(event) {return false};

document.observe('dom:ready', function() {
	var dcal = new DCalendar.core({wrapper: $('main')});
	dcal.show();
});