/**
 * Created by tyler on 5/2/14.
 */

var http = require('http');
var nconf = require('nconf');
var config = require('./config');

// nconf setup
nconf
    .argv()
    .env()
    .file('instance', {
        file : 'config/env/instance.json'
    })
    .file({
        file : 'config/env/default.json'
    });

var port = nconf.get('port');

/**
 * Validates state and required config values
 */
var validate = function(){
    var isSetup = nconf.get('isSetup');

    if(isSetup) {
        if(!nconf.get('apiKey')){
            throw new Error('API Key must be present.');
        }

        if(!nconf.get('googleAccount')){
            throw new Error('Google Account is not connected.');
        }

        if(!nconf.get('googleApp')){
            throw new Error('Google App credentials not present.');
        }
    }
};

/**
 * Runs OOcharts server
 */
var run = function(){
    validate();

    http.createServer(config.express).listen(port, function () {
        console.log('OOcharts server running on port ' + port);
    });
};

run();