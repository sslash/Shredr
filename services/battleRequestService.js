var mongoose      = require('mongoose'),
Q             = require('q'),
fileHandler   = require('../libs/fileHandler'),
userService    = require('./userService'),
Battle         = mongoose.model('Battle'),
feedService    = require('./feedService'),
BattleRequest = mongoose.model('BattleRequest');

exports.create = function (opts) {
    var def = Q.defer();
    new BattleRequest(opts).create()
    .then(function(res) {

        // because this fetch populates the model
        BattleRequest.findById(res.id)
        .then(def.resolve, def.reject).done();
    }).done();
    return def.promise;
};


exports.uploadJamtrack = function (brId, req) {
    var def = Q.defer();
    var battleRequest = {};
    BattleRequest.findById(req.params.id)

    // store video file
    .then(function(result) {
        battleRequest = result;
        req.filePath = './public/audio/br/';
        return fileHandler.storeAudioFile(req);
    })

    // Save the reference to the local file
    .then(function(result) {
        battleRequest.jamtrackFileId = result.file.name;
        battleRequest.save(function(err,res){
        if ( err ) { return def.reject(err); }
            def.resolve(battleRequest);
        });
    })
    .fail(def.reject).done();

    return def.promise;
};

exports.uploadInitialVideo = function (brId, req) {
    var def = Q.defer();

    var battleRequest = {};
    BattleRequest.findById(brId)

    // store video file
    .then(function(doc) {
        battleRequest = doc;
        var args = {};
        args.path = './public/video/br/';
        return fileHandler.storeVideoFile(req, args);
    })
    // Save the reference to the local file
    .then(function(result) {
        battleRequest.advVidFile = result.file.name;
        battleRequest.save(function(err,res) {
        if ( err ) { return def.reject(err); }
            def.resolve(battleRequest);
        });
    })
    .fail(function(err) {
        def.reject(err);
    }).done();
    return def.promise;
};


var sendBrNotification = function (br) {
    return br.battlee.addNotification({
        type : 3,
        body : 'New Battle Request received from ' + br.battler.username,
        id  : br._id.toString() + new Date().getTime(),
        referenceId : br._id.toString()
    });
};

exports.updateBattleRequest = function (brId, body) {
    var battleRequst = {};
    return BattleRequest.findById(brId)
    .then(function(br){
        battleRequest = br;
        br.startFrame = body.startFrame;
        br.startSec = body.startSec;
        br.duration = body.duration;
        br.save();
    })
    // send notification to battlee
    .then(function(br) {
        return sendBrNotification(battleRequest);
    });
};

var sendBrRespondNotification = function (type, response, battler, battlee, referenceId) {
    return battler.addNotification({
        type : type,
        body : 'Battle request to ' + battlee.username + ' was ' + response,
        id  : referenceId + new Date().getTime(),
        referenceId : referenceId
    });
};


/**
* Fetches battle request
* Creates battle object and saves it
* Sends a notification to the battler initiator
* Delete the battle requestobject after
* Creates a new feed object and sends it to fans of
*     battlers and battlees
*/
exports.acceptBattleRequest = function (battleId) {
    var def = Q.defer();
    var battler = {}, battleRequest, battle, battlee;
    BattleRequest.findById(battleId)
    // copy things over from battle request object
    .then(function(br) {
        if(!br) { throw new Error('Battle Request with id: ' + battleId + ' wasn\'t found'); }

        battleRequest = br;
        battle = new Battle();
        battle.battler = br.battler._id.toString();
        battle.battlee = br.battlee._id.toString();
        battle.numRounds = br.rounds;
        battle.dayLimit = br.dayLimit;
        battle.mode = br.mode;
        battle.statement = br.statement;

        if ( br.mode === 'Advanced') {
            // set jamtrack
            if ( br.jamtrackId ) {
                battle.jamtrackId = br.jamtrackId._id.toString();
            } else {
                battle.jamtrackFileId = br.jamtrackFileId;
            }
        }

        // set video files
        battle.rounds = [];
        battle.rounds[0] = [
        {
            videoFileId : br.advVidFile,
            createdAt : new Date(),
            startSec : 0,
            startFrame : 0,
            duration : br.duration,
            rating : { raters : 0, currentValue : 0 }
        }
        ];

        // need to save in order to send notification
        battler = br.battler;
        battlee = br.battlee;
        return battle.save();
    })

    // send notification and delete battlerequest object
    .then(function() {
        var battleId = battle._id.toString();
        sendBrRespondNotification(4, 'accepted', battler, battlee, battleId);

        // save battle ids in user objs, dont care if it went well.. (TODO)
        userService.addBattleReference(battler, battleId);
        userService.addBattleReference(battlee, battleId);
        return battleRequest.remove();
    })
    // create feed, send to battler and battlee
    .then(function () {
        return feedService.broadcastNewBattleFeed(battle);
    })
    .then(function () {
        def.resolve(battle);
    })
    .fail(function(err) {
        def.reject(err);
    }).done();

    return def.promise;
};

exports.declineBattleRequest = function (brId) {
    return BattleRequest.findById(brId)
    .then(function(br) {
        sendBrRespondNotification(5, 'declined', br.battler, br.battlee,
        br.battlee._id.toString());
        return br.remove();
    })
    .fail(function(err) {
        throw err;
    });
};
