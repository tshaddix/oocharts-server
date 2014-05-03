var moment;

moment = require('moment');

exports.parseData = function(cols, rows) {
    var c, col, col_funcs, col_type, data_type, result_row, results, row, _i, _j, _k, _len, _len1, _len2;
    col_funcs = [];
    for (_i = 0, _len = cols.length; _i < _len; _i++) {
        col = cols[_i];
        col_type = col.columnType.toLowerCase();
        if (col_type === 'metric') {
            data_type = col.dataType.toLowerCase();
            switch (data_type) {
                case 'integer':
                    col_funcs.push(function(val) {
                        return parseInt(val);
                    });
                    break;
                case 'float':
                case 'currency':
                case 'time':
                case 'percent':
                    col_funcs.push(function(val) {
                        return parseFloat(val);
                    });
                    break;
                default:
                    col_funcs.push(function(val) {
                        return val;
                    });
            }
        } else if (col_type === 'dimension') {
            switch (col.name) {
                case 'ga:date':
                    col_funcs.push(function(val) {
                        var mom;
                        mom = moment(val, 'YYYYMMDD');
                        return mom.format('YYYY-MM-DD');
                    });
                    break;
                case 'ga:visitCount':
                case 'ga:visitLength':
                case 'ga:year':
                case 'ga:month':
                case 'ga:week':
                case 'ga:hour':
                case 'ga:dayOfWeek':
                case 'ga:day':
                case 'ga:daysSinceLastVisit':
                case 'ga:adSlotPosition':
                case 'ga:pageDepth':
                case 'ga:nthDay':
                case 'ga:nthMonth':
                case 'ga:nthWeek':
                    col_funcs.push(function(val) {
                        return parseInt(val);
                    });
                    break;
                case 'ga:latitude':
                case 'ga:longitude':
                    col_funcs.push(function(val) {
                        return parseFloat(val);
                    });
                    break;
                case 'ga:isMobile':
                case 'ga:javaEnabled':
                    col_funcs.push(function(val) {
                        var _ref;
                        return (_ref = val.toLowerCase() === 'yes') != null ? _ref : {
                            "true": false
                        };
                    });
                    break;
                default:
                    col_funcs.push(function(val) {
                        return val;
                    });
            }
        } else {
            throw "Unknown columnType: " + col_type;
        }
    }
    results = [];
    for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
        row = rows[_j];
        result_row = [];
        for (c = _k = 0, _len2 = row.length; _k < _len2; c = ++_k) {
            col = row[c];
            result_row.push(col_funcs[c](col));
        }
        results.push(result_row);
    }
    return results;
};
