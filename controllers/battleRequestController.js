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
    dayLimit : req.body.dayLimit,
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

  exports.declineBattleRequest = function (req, res) {
      battleRequestService.declineBattleRequest(req.params.id)
      .then(client.send.bind(null, res, null))
      .fail(client.error.bind(null, res))
      .done();
  };

  exports.acceptBattleRequest = function (req, res) {
      battleRequestService.acceptBattleRequest(req.params.id)
      .then(client.send.bind(null, res, null))
      .fail(client.error.bind(null, res))
      .done();
  };
