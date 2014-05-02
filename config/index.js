/**
 * Created by tyler on 5/2/14.
 */

var nconf = require('nconf');

nconf.use('memory');
nconf.argv().env();

// Load configuration
nconf.add('default', { type : 'file', file : 'config/env/config.json' });

exports.express = require('./express');