/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var router = module.exports = express.Router();
var nconf = require('nconf');
var path = require('path');
var url = require('url');
var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;

var GOOGLE_AUTH_SCOPE = 'https://www.googleapis.com/auth/analytics';

router
    .use(function(req, res, next){
        if(nconf.get('isSetup') === true){
            res.send(403, 'OOcharts server has already been setup.');
        } else {
            next();
        }
    })

    .get('/', function(req, res, next){
        res.render('configure');
    })

    .post('/', function(req, res, next){
        var googleClientId = (req.body.googleClientId || '').trim();
        var googleClientSecret = (req.body.googleClientSecret || '').trim();
        var apiKey = (req.body.apiKey || '').trim();
        var hostUrl = (req.body.hostUrl || '').trim();

        var _error = function(err){
            res.render('configure', { error : err });
        };

        if(!googleClientId) return _error("Google Client Id is required.");
        if(!googleClientSecret) return _error("Google Client Secret is required.");
        if(!hostUrl) return _error("Host URL is required.");

        // TODO: Better Validation for API Key and HOST URL

        if(!apiKey){
            // TODO: Generate API Key
            apiKey = "AAAAA1111111BBBBBBCCCCCCC";
        }

        nconf.set('googleApp:clientId', googleClientId);
        nconf.set('googleApp:clientSecret', googleClientSecret);
        nconf.set('hostUrl', hostUrl);
        nconf.set('apiKey', apiKey);

        nconf.save(function(err){
            if(err) return _error(err);

            var oauth2Client = new OAuth2(
                googleClientId,
                googleClientSecret,
                url.resolve(hostUrl, '/setup/google-callback')
            );

            var authUrl = oauth2Client.generateAuthUrl({
                access_type : 'offline',
                scope : GOOGLE_AUTH_SCOPE,
                approval_prompt : 'force'
            });

            res.redirect(authUrl);
        });
    })

    .get('/google-callback', function(req, res, next){
        var error = req.query.error;
        var code = req.query.code;

        // TODO: Proper error handling

        if(!code) return res.redirect('/setup');

        var oauth2Client = new OAuth2(
            nconf.get('googleApp:clientId'),
            nconf.get('googleApp:clientSecret'),
            url.resolve(nconf.get('hostUrl'), '/setup/google-callback')
        );

        oauth2Client.getToken(code, function(err, tokens){
           if(err) return next(err);

            nconf.set('googleAccount:accessToken', tokens.access_token);
            nconf.set('googleAccount:refreshToken', tokens.refresh_token);
            nconf.set('isSetup', true);

            nconf.save(function(err) {
                if(err) return next(err);

                res.locals.apiKey = nconf.get('apiKey');
                res.render('configure-success');
            });
        });
    });