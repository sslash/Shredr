var mongoose       = require('mongoose'),
    _              = require('underscore'),
    Battle         = mongoose.model('Battle'),
    query          = require('../libs/query.js'),
    Q              = require('q'),
    fileHandler    = require('../libs/fileHandler');

    /* Helper functions */
    function hasVoted (userId, votes) {
        return votes.indexOf(userId) > -1;
    };

module.exports = {
    getById : function(id) {
        // returns a promise
        return Battle.findById(id);
    },

    getMany : function () {
        var deferred = Q.defer();

        query.query(Battle)
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

    getBattlesByUser : function (user) {
        return Battle.findMany(user.battles);
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

            return battle.saveOrUpdate(true)
        })
        .then(deferred.resolve.bind(null));

        return deferred.promise;
    },

    TODO: CONTINUE HERE. DO THIS FOR:
    - WHEN LOGGING IN
    - WHEN ACCESSING A BATTLE (NOT COLLECTION VIEW). HOWEVER THIS DOES NOT USE THIS PARTICUL FN, BUT SOHULD USE THE ONE IN BATTLE.jS
    findAndClearBattles : function (user) {
        module.exports.getBattlesByUser(user)
        .then(function(battles) {

            battles.forEach(function(battle){
                battle.checkIfFinished();
            })
        });
    }
};
