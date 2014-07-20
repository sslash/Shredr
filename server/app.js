var http = require('http');
var express = require('express');
var async = require('async');
var mongoose = require('mongoose');
var mongoConfig = require('../config/mongoConfig');
var mongoose    = mongoose || require('mongoose');
var schema      = mongoose.Schema;
var passport    = require('passport');
var fs          = require('fs');
var config      = require('../config/config');

var modelsPath = config.root + '/models';

mongoConfig.connectToMongo();

fs.readdirSync(modelsPath).forEach(function (file) {
	if (file.indexOf('.js') >= 0) {
		require(modelsPath + '/' + file);
	}
});

var app = express();

require('../config/passport')(passport, config);

// Logging
require('../config/express')(app, config, passport);
require('../config/routes')(app, passport);

var port = process.env.PORT || 5000;

// start server
http.createServer(app).listen(port, function(){
	console.log('Express App started!');
});
