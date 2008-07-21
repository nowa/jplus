// 
//  Range
//  JPlus -> range.js
//  
//  Created by nowa on 2008-07-21.
//  Copyright 2008 jplus.nowazhu.com. All rights reserved.
// 

// from prototype1.6
var ObjectRange = Class.create(Enumerable, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },
  
  _each: function(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  },
  
  include: function(value) {
    if (value < this.start) 
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
};
