// TODO: use a separate testDB
var mongoConfig    = require(process.cwd() + '/config/mongoConfig');
var mongoose       = mongoose || require('mongoose');
var fs             = require('fs');

mongoConfig.connectToMongo();
var modelsPath = process.cwd() + '/models';

fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
    }
});
