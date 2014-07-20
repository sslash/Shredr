var _              = require('underscore'),
    client         = require('../libs/responseClient'),
    battleService  = require('../services/battleService'),
    BaseController = require("./baseController");

module.exports = BaseController.extend({

    show : function(req, res) {
        battleService.getById(req.params.id)
        .then(battleService.getManyRelated)
        .then(function(result) {
            var b = result.modelBS;

            // render hbs
            module.exports.render(req, res, _.extend(result, {
                type : 'battles',
                modelBS : b,
                collBS : result.collBS,
                round : b.rounds[0],
                onlyOneVid :  (b.rounds[0].length === 1),
                tpl : 'battle/battleDetailLayout'
            }));
        });
    },

    getJSON : function (req, res) {
        battleService.getById(req.params.id)
        // get related ?
        .then(client.send.bind(null, res, null));
    },

    list : function(req, res) {
        battleService.getMany()
        .then(function(result){
            module.exports.render(req, res, _.extend(result, {
                type : 'battles',
                tpl : 'stage/stageBattlesLayout'
            }));
        });
    },

    postBattleRoundVideo : function (req, res) {
        try {
            battleService.storeBattleRoundVideo(req.params.id, req)
            .then(function(doc) {
                client.send(res, null, doc);
            })
            .fail(function(err) {
                client.send(res,err);
            });
        }catch(e) {
            console.log('ERROR : ' + e)
        }
    },

    postBattleRound : function (req, res) {
        try {
            battleService.storeBattleRound(req.params.id, req.body)
            .then(client.send.bind(null,res, null))
            .fail(client.error.bind(null,res));
        }catch(e) {
            console.log('ERROR ' + e);
        }
    },

    postVote : function (req, res) {
        var userId = req.session.passport.user.toString();
        battleService.postVote(userId, req.params.id, req.params.battlerOrBattlee)
        .then(client.send.bind(null, res, null))
        .fail(client.error.bind(null,res));
    },

    postComment : function (req, res) {
        var userId = req.session.passport.user.toString();
        battleService.postComment(userId, req.params.id, req.body)
        .then(client.send.bind(null, res, null))
        .fail(client.error.bind(null,res));
    }



    // get the battle, and related battles
    // get : function (req, res) {
    //     var battle = {};
    //     Battle.findById(req.params.id)
    //     .then(function(doc) {
    //         battle = doc;
    //         return query.query(Battle);
    //     })
    //     .then(function(coll) {
    //         var rounds = battle.rounds[battle.rounds.length-1];
    //         if ( rounds.turns.length == 1 ) {
    //             rounds.turns[1] = {
    //                 videoFileId : ''
    //             }
    //         }
    //         module.exports.render(req, res, {
    //             modelBS : battle,
    //             collBS  : coll,
    //             type : 'battles',
    //             round : rounds
    //         });
    //     })
    //     .fail ( function(err) {
    //         console.log('failed.. ' + err);
    //     });
    // },


    /**
    * add a new battleround video (post-battleround part 1 of 2)
    */
    //postBattleRoundVideo : function (req, res) {
        // ze battle to return to user
        // var battle = {};
        //
        // Battle.findSimple(req.params.id)
        // // store video file
        // .then(function(doc) {
        //     battle = doc;
        //     var args = {};
        //     args.path = './public/video/battle/';
        //     return fileHandler.storeVideoFile(req, args);
        // })
        // // Get current battle round, and save the reference to the video
        // .then(function(result) {
        //
        //     var i = battle.rounds.length-1;
        //     var turn = { videoFileId : result.file.name };
        //
        //     // if we need to start a new round, create turns array
        //     // and populate index 0
        //     if (battle.rounds[i].turns.length === 2) {
        //         battle.rounds.push({
        //             turns : [turn]
        //         });
        //
        //     // else add a turn
        //     } else {
        //         battle.rounds[i].turns.push(turn);
        //     }
        //
        //     battle.markModified('rounds');
        //     battle.save();
        // })
        // // send notification to battlee
        // .then(function(doc) {
        //     return client.send(res, null, battle);
        // })
        // .fail (function(err) {
        //     return client.error(res, err);
        // });
//    },

    /**
    * add a new battleround metadata  (post-battleround part 2 of 2)
    */
//    postBattleRound : function (req, res) {
        //
        // var result = {};
        // Battle.findSimple(req.params.id)
        // .then(function(battle) {
        //     result = battle;
        //
        //     // get current round
        //     var i = battle.rounds.length-1;
        //     // either add meta to index 0, or 1
        //     var index = battle.rounds[i].turns.length === 2 ? 1 : 0;
        //
        //     _.extend(battle.rounds[i].turns[index], {
        //         startFrame : req.body.startFrame,
        //         startSec   : req.body.startSec
        //     });
        //     battle.markModified('rounds');
        //     battle.save();
        // })
        // // send notification to battlee
        // .then(function(doc) {
        //     return client.send(res, null, result);
        // })
        // .fail (function(err) {
        //     return client.error(res, err);
        // });
    //}
});

//util.inherits(BattleController, BaseController);
//
// BattleController.prototype.create = function (req, res) {
//
// };
//
// BattleController.prototype.update = function (req, res) {
//
// };
//
// BattleController.prototype.delete = function (req, res) {
//
// };

//module.exports = BattleController;
