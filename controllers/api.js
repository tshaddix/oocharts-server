/**
 * Created by tyler on 5/2/14.
 */


var express = require('express');
var router = module.exports = express.Router();
var config = require('../config');
var gaValidator = require('ga-validator');
var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;
var moment = require('moment');
var services = require('services');
var dateService = services.date;

var oauth2Client;

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
    })

    .param('responseType', function(req, res, next, rt){
        if(rt === 'json'){
            res.respond = function(a, b){
                res.json(a, b);
            };
        } else if(rt === 'jsonp'){
            res.respond = function(a, b){
                res.jsonp(a, b);
            };
        } else {
            return res.send(400, 'Unsupported response type: ' + rt + '.');
        }

        next();
    })

    .use(function(req, res, next){
        oauth2Client = oauth2Client || new OAuth2(
            config.get('googleApp:clientId'),
            config.get('googleApp:clientSecret'),
            url.resolve(config.get('hostUrl'), '/setup/google-callback')
        );

        next();
    })

    .get('/dynamic.:responseType', function(req, res, next){

        var invalidParam = function(msg){
            res.respond(400, {
                error : msg
            });
        };

        if(req.query.index &&  /^[0-9]+$/.test(index)){
            return invalidParam('Invalid param {index}: Must be a valid integer.');
        }

        if(req.query.maxResults && /^[0-9]+$/.test(maxResults)){
            return invalidParam('Invalid param {maxResults}: Must be a valid integer.');
        }
        
        if(!req.query.metrics){
            return invalidParam ('Invalid param {metrics}: Parameter is required.');
        }
        
        if(!req.query.profile){
            return invalidParam('Invalid param {profile}: Parameter is required.');
        }
        
        var metrics = req.query.metrics.split(',');
        
        for(var _m = 0; _m < metrics.length; m++){
            if(!gaValidator.checkMetric(metrics[_m])){
                return invalidParam('Invalid param {metrics}: ' + metrics[_m] + ' is not valid metric.');
            }
        }

        if(metrics.length === 0) return invalidParam('Invalid param {metrics}: Must provide at least one metric.');

        var dimensions = [];

        if(req.query.dimensions) {
            dimensions = req.query.dimensions.split(',');

            for (var _d = 0; _d < dimensions.length; d++) {
                if (!gaValidator.checkDimension(dimensions[_d])) {
                    return invalidParam('Invalid param {dimensions}: ' + dimensions[_d] + ' is not valid dimension.');
                }
            }
        }

        if(req.query.filters && !gaValidator.checkFilter(req.query.filters)){
            return invalidParam('Invalid param {filters}: Filter string is not in valid format');
        }

        if(req.query.segment && !gaValidator.checkSegment(req.query.segment)){
            return invalidParam('Invalid param {segment}: Segment is not in valid format');
        }

        var sort = [];

        if(req.query.sort){
            sort = req.query.sort.split(',');

            for(var _s = 0; _s < sort.length; _s++){
                if(!gaValidator.checkSort(sort[_s])){
                    return invalidParam('Invalid param {sort}: ' + sort[_s] + ' is not in valid format.')
                }
            }
        }

        if(!req.query.start || !dateService.isValidDate(req.query.start)){
            return invalidParam('Invalid param {start}: Should be of form YYYY-MM-DD.');
        }

        if(req.query.end){
            if(!dateService.isValidDate(req.query.end)){
                return invalidParam('Invalid param {end}: Should be of form YYYY-MM-DD.');
            }

            if(dateService.isRelativeDate(req.query.start) && dateService.isRelativeDate(req.query.end)){
                return invalidParam('Invalid Params {end} and {start}: One value should be of form YYYY-MM-DD');
            }
        }

        var endDate, startDate;

        if(!req.query.end){
            req.query.end = moment().format('YYYY-MM-DD');
        }

        if(!dateService.isRelativeDate(req.query.start)){
            startDate = moment(req.query.start).startOf('day');
        }

        if(!dateService.isRelativeDate(req.query.end)){
            endDate = moment(req.query.end).startOf('day');
        }


    });
