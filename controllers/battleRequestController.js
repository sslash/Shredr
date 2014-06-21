var mongoose   = require('mongoose'),
BattleRequest = mongoose.model('BattleRequest'),
client         = require('../libs/responseClient'),
battleRequestService = require('../services/battleRequestService'),
fileHandler = require('../libs/fileHandler');
Battle     = mongoose.model('Battle');

exports.renderBattle = function (req, res) {
  res.render(path.join( __dirname, '../app/templates/battle/battleLayout' ), fullBootstrap);
};

exports.create = function (req, res) {

  battleRequestService.create({
    battler : req.user,
    battlee : req.body.battlee,
    statement: req.body.statement,
    rounds : req.body.rounds,
    mode : req.body.mode,
    jamtrackId : req.body.jamtrackId || null

  })
  .then(client.send.bind(null, res, null))
  .fail(client.error.bind(null, res))
  .done();
  };

  // Initial battle request jamtrack file.
  exports.uploadJamtrack = function (req, res) {
    battleRequestService.uploadJamtrack(req.params.id, req)
    .then(client.send.bind(null, res, null))
    .fail(client.error.bind(null, res))
    .done();
  };

  // initial video uploaded
  exports.uploadInitialVideo = function (req, res) {
    battleRequestService.uploadInitialVideo(req.params.id, req)
    .then(client.send.bind(null, res, null))
    .fail(client.error.bind(null, res))
    .done();
  };

  // only advanced mode.
  // Used to store meta data about video
  exports.updateBattleRequest = function (req, res) {
    battleRequestService.updateBattleRequest(req.params.id, req.body)
    .then(client.send.bind(null, res, null))
    .fail(client.error.bind(null, res))
    .done();
  };

  exports.getBattleRequest = function (req, res) {
    BattleRequest.findById(req.params.id)
    .then(function(result){
      client.send(res, null, result);
    })
    .fail(function(err){
      client.error(res, err);
    });
  };

  exports.acceptBattleRequest = function (req, res) {
    var battler = {}, battleRequest;
    BattleRequest.findById(req.params.id)
    // copy things over from battle request object
    .then(function(br){
      battleRequest = br;
      battle = new Battle();
      battle.battler = br.battler._id.toString();
      battle.battlee = br.battlee._id.toString();
      battle.numRounds = br.rounds;
      battle.mode = br.mode;
      var fileId = br.fileId;

      if ( br.mode === 'Advanced') {
        // set jamtrack
        if ( br.jamtrackId ) {
          battle.jamtrackId = br.jamtrackId._id.toString();
        } else {
          battle.jamtrackFileId = fileId;
        }

        // battlerequest advanced-mode files have a different name. lame
        fileId = br.advVidFile;
      }

      // set video files
      battle.rounds = [];
      battle.rounds[0] = {
        turns : [{
          videoFileId : fileId,
          createdAt : new Date(),
          rating : { raters : 0, currentValue : 0 }
        }]
      };

      battle.save();
    })

    // delete battlerequest object
    .then(function() {
      battleRequest.remove();
    })
    .then(function(){
      client.send(res, null, battle);
    })
    .fail(function(err) {
      client.error(res, err);
    })
  };
