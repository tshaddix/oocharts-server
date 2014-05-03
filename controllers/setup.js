/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var router = module.exports = express.Router();
var config = require('../config');
var path = require('path');
var url = require('url');
var googleapis = require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;

var GOOGLE_AUTH_SCOPE = 'https://www.googleapis.com/auth/analytics';

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
        var googleClientId = req.body.googleClientId;
        var googleClientSecret = req.body.googleClientSecret;
        var apiKey = req.body.apiKey;
        var hostUrl = req.body.hostUrl;

        if(!googleClientId) return res.redirect('/setup');
        if(!googleClientSecret) return res.redirect('/setup');
        if(!hostUrl) return res.redirect('/setup');

        if(!apiKey){
            // TODO: Generate API Key
            apiKey = "AAAAA1111111BBBBBBCCCCCCC";
        }

        config.set('googleApp:clientId', googleClientId);
        config.set('googleApp:clientSecret', googleClientSecret);
        config.set('hostUrl', hostUrl);
        config.set('apiKey', apiKey);

        config.save(function(err){
            if(err) return next(err);

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
            config.get('googleApp:clientId'),
            config.get('googleApp:clientSecret'),
            url.resolve(config.get('hostUrl'), '/setup/google-callback')
        );

        oauth2Client.getToken(code, function(err, tokens){
           if(err) return next(err);

            config.set('googleAccount:accessToken', tokens.access_token);
            config.set('googleAccount:refreshToken', tokens.refresh_token);
            config.set('state', 'authorized');

            config.save(function(err) {
                if(err) return next(err);

                res.send('OOcharts Server is now configured! API Key: ' + config.get('apiKey'));
            });
        });
    });