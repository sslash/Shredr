var mongoose       = require('mongoose'),
    _              = require('underscore'),
    Battle         = mongoose.model('Battle'),
    query          = require('../libs/query.js'),
    userService    = require('./userService'),
    Q              = require('q'),
    fileHandler    = require('../libs/fileHandler');

    /* Helper functions */
    function hasVoted (userId, votes) {
        return votes.indexOf(userId) > -1;
    };

module.exports = {
    getById : function(id) {
        // returns a promise
        return Battle.load(id);
    },

    query : function (q) {
        var opts = {criteria : {}};
        opts.populate = 'battler battlee';

        // search for battler or battlee with given username
        if (q.q && q.q.length) {
            var def = Q.defer();

            userService.getByUsername(q.q)
            .then(function (res) {
                if (!res.length) return [];

                opts.query = {
                    or : [
                        {battler : res[0]._id},
                        {battlee : res[0]._id}
                    ]
                };
                return query.query(Battle, opts);
            })
            .then (def.resolve)
            .fail(def.resolve.bind(null, [])).done();

            return def.promise;
        } else {
            return query.query(Battle, opts);
        }
    },

    getMany : function () {
        var deferred = Q.defer();

        query.query(Battle, {populate : 'battler battlee'})
        .then( function(doc) {
            deferred.resolve({
                collBS : doc
            });
        })
        .fail(function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    },

    storeBattleRoundVideo : function(id, req) {
        var deferred = Q.defer();
        var ret = {};

        Battle.findSimple(id)
        .then(function(battle) {
            ret = battle;
            var args = {};
            args.path = './public/video/battle/';
            return fileHandler.storeVideoFile(req, args)

            // Get current battle round, and save the reference to the video
            .then(function(result) {

                var i = battle.rounds.length-1;
                var turn = { videoFileId : result.file.name };

                // if we need to start a new round, create turns array
                // and populate index 0
                if (battle.rounds[i].length === 2) {
                    battle.rounds.push([turn]);

                // else add a turn
                } else {
                    battle.rounds[i].push(turn);
                }

                battle.markModified('rounds');

                battle.save(function(err) {
                    if (err) {deferred.reject(err); }
                    else { deferred.resolve(battle); }
                });
            })
        })
        // // TODO: send notification to battlee
        .fail (function(err) {
            return deferred.reject(err);
        });

        return deferred.promise;
    },

    storeBattleRound : function (id, body) {
        var deferred = Q.defer();

        Battle.findSimple(id)
        .then(function(battle) {

            // get current round
            var i = battle.rounds.length-1;
            // either add meta to index 0, or 1
            var index = battle.rounds[i].length === 2 ? 1 : 0;

            _.extend(battle.rounds[i][index], {
                startFrame : body.startFrame,
                startSec   : body.startSec,
                duration   : body.duration,
                createdAt  : new Date()
            });
            battle.markModified('rounds');
            battle.save(function(err) {
                // send notification to battlee
                if (err) {deferred.reject(err); }
                else { deferred.resolve(battle); }
            });
        });


        return deferred.promise;
    },

    getManyRelated : function (battle) {
        var deferred = Q.defer();
        query.query(Battle)
        .then( function(doc) {
            deferred.resolve({
                modelBS : battle,
                collBS : doc
            });
        })
        .fail(function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    },

    getBattlesByUser : function (user, opts) {
        return Battle.findMany(user.battles, opts || {});
    },

    postVote : function (userId, battleId, battlerOrBattlee) {
        var deferred = Q.defer();

        Battle.findSimple(battleId)
        .then(function(battle) {

            if ( battlerOrBattlee === 'battler' ) {
                tryVote(battle.votes.battlers);
            } else if ( battlerOrBattlee === 'battlee' ) {
                tryVote(battle.votes.battlees);
            }

            function tryVote(voters) {
                if ( !hasVoted(userId, voters) ) {
                    voters.push(userId);
                    battle.save(function(err) {
                        if (err) {deferred.reject(err); }
                        else { deferred.resolve(battle); }
                    });
                } else {
                    deferred.reject({error : 'User has already voted'});
                }
            }
        });

        return deferred.promise;
    },

    postComment : function (userId, battleId, body) {
        var deferred = Q.defer();

        Battle.findSimple(battleId)
        .then(function(battle) {
            battle.comments.push({
                body : body.body,
                user : userId
            });

            return battle.saveOrUpdate(true);
        })
        .then(deferred.resolve.bind(null));

        return deferred.promise;
    },

    // Do this type of thing when:
    //
    // When user requests it in /api/user/getUserInfo. happens when SPA loads
    // When accessing a particular battle (not using the service function)
    // When battling
    findAndClearBattles : function (user) {
        return module.exports.getBattlesByUser(user, {populate : ['battler', 'battlee']})
        .then(function(battles) {

            var promises = battles.map(function(battle) {
                return battle.checkIfFinished();
            });

            // Wait until all promises are done, then resolve
            return Q.all(promises);
        });
    }
};
