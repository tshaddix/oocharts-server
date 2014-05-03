/**
 * Created by tyler on 5/2/14.
 */

var nconf = require('nconf');
exports.express = require('./express');

// nconf setup
nconf
    .argv()
    .env()
    .file({
        file : 'config/env/config.json'
    });

/**
 * Get config value
 * @param key
 * @returns {*|String}
 */
exports.get = function(key){
    return nconf.get(key);
};

/**
 * Set config value
 * @param key
 * @returns {*}
 */
exports.set = function(key, value){
    return nconf.set(key, value);
};

/**
 * Save current configuration in store.
 * @param fn
 */
exports.save = function(fn){
    nconf.save(fn);
};