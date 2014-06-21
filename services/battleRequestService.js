var mongoose      = require('mongoose'),
Q             = require('q'),
fileHandler   = require('../libs/fileHandler'),
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
    // // send notification to battlee, in case br is finished
    // .then(function() {
    //   if ( req.params.mode === 'Simple' ) {
    //     return sendBrNotification(battleRequest, res);
    //   } else {
    //     return client.send(res, null, battleRequest);
    //   }
    // })
    // .fail (function(err) {
    //   client.error(res, err);
    // });
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
      br.save();
    })
    // send notification to battlee
    .then(function(br) {
      return sendBrNotification(battleRequest);
    });
  };
