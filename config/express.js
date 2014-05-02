/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var controllers = require('../controllers');

var app = module.exports = express();

app.disable('x-powered-by');

app.use(require('body-parser')());

// Controllers
app.use('/setup', controllers.setup);
app.use('/api', controllers.api);

// TODO: Not found and error middleware