/**
 * Created by tyler on 5/2/14.
 */


var express = require('express');
var router = express.Router();
var config = require('../config');

router
    .use(function(req, res, next){
        if(config.get('state') !== 'authorized'){
            res.send(403, 'OOcharts server has not been setup.');
        } else {
            next();
        }
    })

    .use(function(req, res, next){
        if(config.get('apiKey') !==  req.query.key){
            res.send(403, 'API Key is not valid.');
        } else {
            next();
        }
    });
