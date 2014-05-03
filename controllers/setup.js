/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var router = express.Router();
var config = require('../config');

router
    .use(function(req, res, next){
        if(config.get('state') !== 'installed'){
            res.send(403, 'OOcharts server has already been setup.');
        } else {
            next();
        }
    })

    .get('/', function(req, res, next){

    })

    .post('/', function(req, res, next){

    });