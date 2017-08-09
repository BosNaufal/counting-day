/*!
 * Copyright (c) Naufal Rabbani (http://github.com/BosNaufal)
 * Licensed Under MIT (http://opensource.org/licenses/MIT)
 * 
 * CountingDay @ Version 0.0.5
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CountingDay"] = factory();
	else
		root["CountingDay"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
*
*   Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
*   Licensed Under MIT (http://opensource.org/licenses/MIT)
*   CountingDay.js
*
*/

var CountingDay = function () {
  function CountingDay(options) {
    _classCallCheck(this, CountingDay);

    this.MAX_MONTH = 12;
    var date = options.date,
        month = options.month,
        year = options.year;

    // Default Value

    var now = new Date();
    month = month || now.getMonth() + 1;
    year = year || now.getFullYear();

    var notValid = date < 1 || date > 31 || month < 1 || month > 12 || typeof date !== "number" || typeof month !== "number" || typeof year !== "number";
    if (notValid) throw new Error("[CountingDay]: Invalid constructor argument");

    this.state = _extends({}, options, { month: month, year: year });
    this.state.day = this.getDate().getDay();
    return this;
  }

  _createClass(CountingDay, [{
    key: "getDate",
    value: function getDate() {
      var _state = this.state,
          date = _state.date,
          month = _state.month,
          year = _state.year;

      return new Date(year, month - 1, date);
    }
  }, {
    key: "convertToTwoDigit",
    value: function convertToTwoDigit(num) {
      var string = num.toString();
      var isTwoDigit = string.length >= 2;
      if (isTwoDigit) return string;
      return "0" + string;
    }
  }, {
    key: "getSQLDate",
    value: function getSQLDate(date, month, year) {
      date = date || this.state.date;
      month = month || this.state.month;
      year = year || this.state.year;
      var newDate = this.convertToTwoDigit(date);
      var newMonth = this.convertToTwoDigit(month);
      return year + "-" + newMonth + "-" + newDate;
    }
  }, {
    key: "isLeap",
    value: function isLeap(year) {
      year = year || this.state.year;
      return year % 4 === 0;
    }
  }, {
    key: "maxDayCount",
    value: function maxDayCount(month, year) {
      if (typeof month === "string") throw new Error("[CountingDay]: Invalid month index");

      month = month || this.state.month;
      year = year || this.state.year;

      var THIRTY_ONE = [1, 3, 5, 7, 8, 10, 12];
      var THIRTY = [4, 6, 9, 11];
      var FEBRUARY = 2;

      var isThirtyOne = THIRTY_ONE.find(function (index) {
        return index === month;
      });
      var isThirty = THIRTY.find(function (index) {
        return index === month;
      });
      var isFebruary = FEBRUARY === month;

      if (isThirtyOne) return 31;else if (isThirty) return 30;else if (isFebruary) return this.isLeap(year) ? 29 : 28;else return false; // out of range
    }
  }, {
    key: "validArgument",
    value: function validArgument(variable, errorMessage) {
      if (variable === (undefined || null) || isNaN(variable) || typeof variable !== 'number') {
        throw new Error(errorMessage);
      }
      return true;
    }
  }, {
    key: "addDay",
    value: function addDay(count, initDate, initMonth, initYear) {
      var _this = this;

      this.validArgument(count, "[CountingDay]: Invalid count argument");
      var typeReturn = initDate || initMonth || initYear ? 'object' : 'this';

      var currentDate = (initDate || this.state.date) + count;
      var currentMonth = initMonth || this.state.month;
      var currentYear = initYear || this.state.year;

      var IS_NEGATIVE = count < 0;

      var maxDayMonth = function maxDayMonth() {
        var monthToCount = IS_NEGATIVE ? currentMonth - 1 : currentMonth;
        var maxDay = _this.maxDayCount(monthToCount, currentYear);
        if (!maxDay) {
          if (IS_NEGATIVE) currentYear--;else currentYear++;
          currentMonth = IS_NEGATIVE ? 12 : 1;
          return _this.maxDayCount(currentMonth, currentYear);
        }
        return maxDay;
      };

      var recursive = function recursive() {

        var diff = 0;
        var isOutOfRange = currentDate > maxDayMonth();
        if (IS_NEGATIVE) isOutOfRange = currentDate <= 0;

        if (!isOutOfRange) {
          var dateInstance = new Date(currentYear, currentMonth - 1, currentDate);
          var objectToReturn = {
            day: dateInstance.getDay(),
            date: currentDate,
            month: currentMonth,
            maxDay: _this.maxDayCount(currentMonth, currentYear),
            year: currentYear,
            then: _this
          };
          if (typeReturn === 'this') {
            _this.state = _extends({}, objectToReturn);
            return _this;
          }
          return objectToReturn;
        } else {
          if (IS_NEGATIVE) {
            diff = currentDate + maxDayMonth();
            currentMonth--;
          } else {
            diff = currentDate - maxDayMonth();
            currentMonth++;
          }
          currentDate = diff;
          return recursive();
        }
      };
      return recursive();
    }
  }, {
    key: "addMonth",
    value: function addMonth(count, initDate, initMonth, initYear) {
      var _this2 = this;

      var MAX_MONTH = this.MAX_MONTH;

      this.validArgument(count, "[CountingDay]: Invalid count argument");
      var typeReturn = initDate || initMonth || initYear ? 'object' : 'this';
      var IS_NEGATIVE = count < 0;

      var currentDate = initDate || this.state.date;
      var currentMonth = (initMonth || this.state.month) + count;
      var currentYear = initYear || this.state.year;

      var recursive = function recursive() {
        var diff = 0;
        var isOutOfRange = currentMonth > MAX_MONTH;
        if (IS_NEGATIVE) {
          isOutOfRange = currentMonth <= 0;
          // if (!isOutOfRange && currentMonth === 0) {
          //   diff = currentMonth + MAX_MONTH
          //   currentMonth = diff
          //   currentYear--
          // }
        }

        if (!isOutOfRange) {
          var dateInstance = new Date(currentYear, currentMonth - 1, currentDate);
          var objectToReturn = {
            day: dateInstance.getDay(),
            date: currentDate,
            month: currentMonth,
            maxDay: _this2.maxDayCount(currentMonth, currentYear),
            year: currentYear,
            then: _this2
          };
          if (typeReturn === 'this') {
            _this2.state = _extends({}, objectToReturn);
            return _this2;
          }
          return objectToReturn;
        } else {
          if (IS_NEGATIVE) {
            diff = currentMonth + MAX_MONTH;
            currentYear--;
          } else {
            diff = currentMonth - MAX_MONTH;
            currentYear++;
          }
          currentMonth = diff;
          return recursive();
        }
      };
      return recursive();
    }
  }, {
    key: "get",
    value: function get() {
      var newState = _extends({}, this.state, {
        month: this.state.month
      });
      var date = newState.date,
          month = newState.month,
          year = newState.year;

      var dateInstance = new Date(year, month - 1, date);
      return _extends({}, newState, {
        day: dateInstance.getDay(),
        date: date,
        maxDay: this.maxDayCount(month, year)
      });
    }
  }], [{
    key: "fromDate",
    value: function fromDate(dateInstance) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var validDate = dateInstance.isPrototypeOf(Date);
      if (validDate) throw new Error("[CountingDay]: Invalid Date Instance");
      var day = dateInstance.getDay();
      var date = dateInstance.getDate();
      var month = dateInstance.getMonth() + 1;
      var year = dateInstance.getFullYear();
      return new CountingDay(_extends({}, options, {
        day: day,
        date: date,
        month: month,
        year: year
      }));
    }
  }]);

  return CountingDay;
}();

module.exports = CountingDay;

/***/ })
/******/ ]);
});