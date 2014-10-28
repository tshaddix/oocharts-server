/**
 * Created by tyler on 5/2/14.
 */

var express = require('express');
var exphbs = require('express-handlebars');
var controllers = require('../controllers');
var path = require('path');

var app = module.exports = express();

app.disable('x-powered-by');

// Setup Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'setup', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(require('body-parser')());

// Controllers
app.use('/', controllers.setup);
app.use('/api', controllers.api);

app.use(express.static(path.join(__dirname, '../public')));
