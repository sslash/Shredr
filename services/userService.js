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
    },

    addFan : function (faneeId, user) {
        var def = Q.defer();
        user.addFanee(faneeId)
        .then(function() {
            return User.loadSimple(faneeId)
        })
        .then( function(userRes) {
            return userRes.addFan(user);
        })
        .then ( function (res) {
            def.resolve(user);
        })
        .fail (def.reject).done();

        return def.promise;
    },

    clearNotifications : function(user) {
        var def = Q.defer();
        user.notifications.length = 0;
        user.notifications = [];
        user.update({notifications : []}, function(err,res) {
            if (err) { def.reject(err); }
            def.resolve(res);
        });
        return def.promise;
    },

    /**
    * Users have references to all the battles they
    * are included in
    */
    addBattleReference : function(user, battleId) {
        user.battles.push(battleId);
        user.save();
    }
};
