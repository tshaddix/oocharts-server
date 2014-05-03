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
var services = require('../services');
var dateService = services.date;
var gaParser = services.gaParser;
var url = require('url');

var oauth2Client, analyticsClient;

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
        if(rt === 'json' || rt === 'jsonp'){
            req.rt = rt;
        } else {
            return res.send(400, 'Unsupported response type: ' + rt + '.');
        }

        next();
    })

    .use(function(req, res, next){

        if(!oauth2Client) {
            oauth2Client = new OAuth2(
                config.get('googleApp:clientId'),
                config.get('googleApp:clientSecret'),
                url.resolve(config.get('hostUrl'), '/setup/google-callback')
            );

            oauth2Client.credentials = {
                access_token: config.get('googleAccount:accessToken'),
                refresh_token: config.get('googleAccount:refreshToken')
            };
        }

        if(!analyticsClient){
            googleapis.discover('analytics', 'v3').execute(function(err, client) {
                if(err) return next(err);

                analyticsClient = client;
                next();
            });
        } else {
            next();
        }
    })

    .get('/dynamic.:responseType', function(req, res, next){

        var invalidParam = function(msg){
            res[req.rt](400, {
                error : msg
            });
        };

        if(typeof req.query.index !== 'undefined' &&  /^[0-9]+$/.test(index)){
            return invalidParam('Invalid param {index}: Must be a valid integer.');
        }

        if(typeof req.query.maxResults !== 'undefined' && /^[0-9]+$/.test(maxResults)){
            return invalidParam('Invalid param {maxResults}: Must be a valid integer.');
        }
        
        if(!req.query.metrics){
            return invalidParam ('Invalid param {metrics}: Parameter is required.');
        }
        
        if(!req.query.profile){
            return invalidParam('Invalid param {profile}: Parameter is required.');
        }
        
        var metrics = req.query.metrics.split(',');
        
        for(var _m = 0; _m < metrics.length; _m++){
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

        if(dateService.isRelativeDate(req.query.end)){
            endDate = dateService.relatizeDate(startDate, req.query.end, false);
        }

        if(dateService.isRelativeDate(req.query.start)){
            startDate = dateService.relatizeDate(endDate, req.query.start, true);
        }

        if(!startDate.isValid()){
            return invalidParam('Invalid param {start}: Not a valid date.');
        }

        if(!endDate.isValid){
            return invalidParam('Invalid param {end}: Not a valid date.');
        }

        if(startDate.isBefore('2005-01-01')){
            return invalidParam('Invalid param {start}:  Date can not be before 01-01-2005');
        }

        if(endDate.isBefore('2005-01-01')){
            return invalidParam('Invalid param {end}:  Date can not be before 01-01-2005');
        }

        if(endDate.isBefore(startDate)){
            return invalidParam('Invalid param {end}: End date can not be before start date');
        }

        var index = typeof req.query.index !== 'undefined' ? parseInt(req.query.index) : undefined;
        var maxResults = typeof req.query.maxResults !== 'undefined'? parseInt(req.query.maxResults) : undefined;

        var query = {
            ids: 'ga:' + req.query.profile,
            "start-date": startDate.format('YYYY-MM-DD'),
            "end-date": endDate.format('YYYY-MM-DD'),
            metrics: metrics,
            dimensions: dimensions,
            sort: sort,
            fields: 'columnHeaders,rows,totalResults'
        };

        if(req.query.filters){
            query.filters = req.query.filters;
        }

        if(typeof maxResults !== 'undefined'){
            query['max-results'] = maxResults;
        }

        if(req.query.segment){
            query.segment = req.query.segment;
        }

        if(typeof index !== 'undefined'){
            query['start-index'] = index;
        }

        // TODO: Consider Queue from legacy system ("Cue")

        analyticsClient.analytics.data.ga.get(query).withAuthClient(oauth2Client).execute(function(err, result){
            if(err) return next(err);

            res[req.rt]({
                columnHeaders : result.columnHeaders,
                rows : gaParser.parseData(result.columnHeaders, result.rows || []),
                totalResults : result.totalResults
            });

            if(oauth2Client.credentials.access_token !== config.get('googleAccount:accessToken')){
                config.set('googleAccount:accessToken', oauth2Client.credentials.access_token);

                config.save(function(err){
                    if(err) console.error(err);

                    console.log('Google access token updated.');
                });
            }
        });
    });
