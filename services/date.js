/**
 * Created by tyler on 5/3/14.
 */

exports.isValidDate = function(val){
    return /^([0-9]{4}-[0-9]{2}-[0-9]{2})$|^[0-9]+(m|d|w|y)$/.test(val);
};

exports.isRelativeDate = function(val){
    return /^[0-9]+(m|d|w|y)$/.test(val);
};

exports.isDayRelativeDate = function(val){
    return /^[0-9]+d$/.test(val);
};

exports.isWeekRelativeDate = function(val){
    return /^[0-9]+w$/.test(val);
};

exports.isMonthRelativeDate = function(val){
    return /^[0-9]+m$/.test(val);
};

exports.isYearRelativeDate = function(val){
    return /^[0-9]+y$/.test(val);
};