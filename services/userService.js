var mongoose       = require('mongoose'),
    _              = require('underscore'),
    User           = mongoose.model('User'),
    query          = require('../libs/query.js'),
    Q              = require('q'),
    shredService   = require('../services/shredService'),
    battleService  = require('../services/battleService'),
    extend         = require('util')._extend,
    feedService    = require('./feedService'),
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
        var def = Q.defer();
        var user = new User(body);
        user.create()
        .then(function() {
            return feedService.broadcastNewUserFeed({
                user : user
            });
        })
        .then(def.resolve, def.reject).done();
        return def.promise;
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

    update : function (user, body) {
        // only support adding these fields
        var def = Q.defer();
        // dont save empty fields
        for (key in body) {
            if ( !body[key] ) {
                delete body[key];
            }
        }

        user = extend(user, body);

        user.save(function(err) {
            if (err) { def.reject(err); }
            def.resolve(user);
        });

        return def.promise;
    },

    uploadProfileImg : function(user, req) {
        var def = Q.defer();
        var args = {};
        args.filePath = './public/img/profiles/';
        fileHandler.storeImageFile(req, args)

        // Save the reference to the local file
        .then(function(result) {
          user.profileImgFile = '/img/profiles/' + result.file.name;
          user.save(function(err,res) {
            if ( err ) { return def.reject(err); }
            def.resolve(user);
          });
        })
        .fail(function(err) {
          def.reject(err);
        }).done();

        return def.promise;
    },

    /**
    * Users have references to all the battles they
    * are included in
    */
    addBattleReference : function(user, battleId) {
        user.battles.push(battleId);
        user.save();
    },

    query : function (q) {
        var opts = {criteria : {}};
        if (q.q && q.q.length) {
            opts.criteria.username = {'$regex'  : new RegExp(q.q, 'gi')};
        }
        return query.query(User, opts);
    }
};
