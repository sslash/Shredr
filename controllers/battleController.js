var util           = require('util'),
    mongoose       = require('mongoose'),
    Battle         = mongoose.model('Battle'),
    query          = require('../libs/query.js'),
    BaseController = require("./baseController");

module.exports = BaseController.extend({
    // get the battle, and related battles
    get : function (req, res) {
        var battle = {};
        Battle.findById(req.params.id)
        .then(function(doc) {
            battle = doc;
            return query.query(Battle);
        })
        .then(function(coll) {
            var rounds = battle.rounds[battle.rounds.length-1];
            if ( rounds.turns.length == 1 ) {
                rounds.turns[1] = {
                    videoFileId : ''
                }
            }
            module.exports.render(req, res, {
                modelBS : battle,
                collBS  : coll,
                type : 'battles',
                round : rounds
            });
        })
        .fail ( function(err) {
            console.log('failed.. ' + err);
        });
    }
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
