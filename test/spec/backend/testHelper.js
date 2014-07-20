var mongoose       = require('mongoose');
var BattleRequest  = mongoose.model('BattleRequest');
var User           = mongoose.model('User');
var Battle         = mongoose.model('Battle');

module.exports = {

    deleteBattle : function (next) {
        Battle.remove({statement : 'test yolo battle'}, function() {
            next();
        });
    },

    getFanUsers : function (next) {
        User.find({testFan : true}, function(err, res) {
            if(err) { throw err; }
            next(res);
        });
    },

    createBattleRequest : function (next) {
        var user1, user2;

        User.findOne({username : 'testuser'}, function (err, res) {
            if(err){throw err;}
            user1 = res;

            User.findOne({username : 'testuser2'}).exec(function (err, res) {
                if(err){throw err;}
                user2 = res;


                new BattleRequest({
                    "advVidFile" : "sap3.mp4",
                    "battlee" : user1._id.toString(),
                    "battler" : user2._id.toString(),
                    "createdAt" : new Date(),
                    "dayLimit" : 5,
                    "duration" : 12.865,
                    "jamtrackId" : null,
                    "mode" : "simple",
                    "rounds" : 3,
                    "startFrame" : 0,
                    "startSec" : 0,
                    "statement" : "test yolo battle"
                }).save(function(err, res) {
                    if(err){throw err;}
                    next(res._id.toString());
                });
            });
        });
    }
};
