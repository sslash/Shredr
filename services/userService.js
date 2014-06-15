var mongoose       = require('mongoose'),
    _              = require('underscore'),
    User           = mongoose.model('User'),
    query          = require('../libs/query.js'),
    Q              = require('q'),
    shredService   = require('../services/shredService'),
    battleService   = require('../services/battleService'),
    fileHandler    = require('../libs/fileHandler');

module.exports = {

    load : function (id) {
        return User.load(id);
    },

    list : function () {
        var deferred = Q.defer();

        query.query(User)
        .then(deferred.resolve)
        .fail(deferred.reject);
        return deferred.promise;
    },

    create : function (body) {
        var user = new User(body);
        return user.create();
    }
};
