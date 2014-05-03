/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var router = module.exports = express.Router();
var config = require('../config');
var path = require('path');

router
    .use(function(req, res, next){
        if(config.get('state') !== 'installed'){
            res.send(403, 'OOcharts server has already been setup.');
        } else {
            next();
        }
    })

    .get('/', function(req, res, next){
        res.sendfile(path.join(__dirname, '../resources/setup.html'));
    })

    .post('/', function(req, res, next){

    });