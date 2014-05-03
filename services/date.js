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

exports.relatizeDate = function(val, rel, sub){
    sub = sub || false;

    var mut = val.clone();

    var math = sub ? 'subtract' : 'add';

    var push;

    if(exports.isDayRelativeDate(rel)){
        push = parseInt(rel.replace('d', ''));
        mut[math]('days', push);
        return mut;
    }

    if (exports.isWeekRelativeDate(rel)){
        push = parseInt(rel.replace('w', ''));
        mut[math]('weeks', push);
        return mut;
    }

    if(exports.isMonthRelativeDate(rel)){
        push = parseInt(rel.replace('m', ''));
        mut[math]('months', push);
        return mut;
    }

    if(exports.isYearRelativeDate(rel)){
        push = parseInt(rel.replace('y', ''));
        mut[math]('years', push);
        return mut;
    }
};