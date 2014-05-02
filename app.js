/**
 * Created by tyler on 5/2/14.
 */

var http = require('http');

var config = require('./config');
var nconf = require('nconf');
var port = nconf.get('port');

var run = function(){
    http.createServer(config.express).listen(port, function(){
        console.log('OOcharts server running on port ' + port);
    });
};

run();