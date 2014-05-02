/**
 * Created by tyler on 5/2/14.
 */

var http = require('http');

var config = require('./config');
var port = config.get('port');

var run = function(){
    http.createServer(config.express).listen(port, function(){
        console.log('OOcharts server running on port ' + port);
    });
};

run();