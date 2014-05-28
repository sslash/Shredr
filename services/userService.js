var mongoose       = require('mongoose'),
    _              = require('underscore'),
    User           = mongoose.model('User'),
    query          = require('../libs/query.js'),
    Q              = require('q'),
    fileHandler    = require('../libs/fileHandler');

module.exports = {
    getById : function (id) {
        return User.loadSimple(id);
    }
};
