var mongoConfig = require('../config/mongoConfig');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var modelsPath = path.normalize(__dirname + '/..') + '/models';

var connect = function () {

    mongoConfig.connectToMongo();

    fs.readdirSync(modelsPath).forEach(function (file) {
        if (file.indexOf('.js') >= 0) {
            require(modelsPath + '/' + file);
        }
    });
}

exports.up = function(next) {
    connect();
    var Badge = mongoose.model('Badge');

    var novice = new Badge({
        title : 'The Novice',
        img : '/img/icons/shredrwhite.jpg',
        background : '/img/contest.jpg',
        description : 'Welcome to Shredr. You have just registered, and is ready for a new adventure. Shredr opens up a new world for guitar players across the globe. We are very pleased to have you onboard.'
    });

    novice.save(function(err, res){
        next(err);
    });
};

exports.down = function(next) {
    connect();
    var Badge = mongoose.model('Badge');
    Badge.remove({}).exec(function(err,res) {
        next(err);
    });
};
