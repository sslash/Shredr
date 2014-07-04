// TODO: find a way to remove unfinished battlerequests...
// TODO: change the various fileId's to match the way battle does it
var mongoose = require('mongoose'),
Q           = require('q'),
Schema = mongoose.Schema;

var BattleRequestSchema = new Schema({

  // Initiator
  battler: {type : Schema.ObjectId, ref : 'User'},

  // receiver. Sort of
  battlee: {type : Schema.ObjectId, ref : 'User'},

  rounds : {type : Number, default: 1},
  dayLimit : {type : Number, default: 5},
  statement : String,

  // Simple or Advanced
  mode : String,
  createdAt  : {type : Date, default : Date.now},

  // jamtrack
  jamtrackFileId : String,

  // Just the video. Misleading name..
  advVidFile : String,

  // Advanced mode things
  startSec : Number,
  startFrame : Number,

  // Simple mode. Each simplemode video starts
  // right after the prev finishes
  duration : Number,


  // In case for mode2, and the user has chosen an existing jamtrack
  jamtrackId : {type : Schema.ObjectId, ref : 'Jamtrack'}
});

BattleRequestSchema.path('battler').validate(function (user) {
  return typeof user !== "undefined" && user !== null ;
}, 'BattleRequest must have an initiator');

BattleRequestSchema.path('battlee').validate(function (user) {
  return typeof user !== "undefined" && user !== null ;
}, 'BattleRequest must have an opponent');

BattleRequestSchema.methods = {

  create: function (cb) {
    var def = Q.defer();
    this.save(function(err,res){
      if (err) {return def.reject(err);}
        def.resolve(res);
      });
      return def.promise;
    }
  };

  BattleRequestSchema.statics = {
    findById: function (id, cb) {
      var deferred = Q.defer();
      this.findOne({ _id : id })
      .populate('battler')
      .populate('battlee')
      .populate('jamtrackId')
      .exec(function(err,res) {
        if (err) { deferred.reject(err); }
          else { deferred.resolve(res); }
          });
          return deferred.promise;
        },
      };

      mongoose.model('BattleRequest', BattleRequestSchema);
