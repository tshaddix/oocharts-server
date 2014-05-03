/**
 * Created by tyler on 5/2/14.
 */

var http = require('http');

var config = require('./config');
var port = config.get('port');

/**
 * Validates state and required config values
 */
var validate = function(){
    var appState = config.get('state');

    if(appState === 'installed'){

    } else if (appState === 'authorized') {
        if(!config.get('apiKey')){
            throw new Error('API Key must be present.');
        }

        if(!config.get('googleAccount')){
            throw new Error('Google Account is not connected.');
        }

        if(!config.get('googleApp')){
            throw new Error('Google App credentials not present.');
        }
    } else {
        throw new Error('Invalid application state.');
    }
};

/**
 * Runs OOcharts serve
 */
var run = function(){
    validate();

    http.createServer(config.express).listen(port, function(){
        console.log('OOcharts server running on port ' + port);
    });
};

run();