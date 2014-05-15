var mongoose = require('mongoose'),
	config = require('../config/config'),
  Q       = require('q'),
	Schema = mongoose.Schema;

/**
 * Shred Schema
 */

var ConversationSchema = new Schema({
  messages: {type:[]},
  recipient : {type : Schema.ObjectId, ref : 'User'},
  originator : {type : Schema.ObjectId, ref : 'User'}
});
/**
 * Pre-remove hook
 */
ConversationSchema.pre('remove', function (next) {
  // Do stuff before removing
  next();
});

/**
 * Instance Methods
 */
ConversationSchema.methods = {

  create: function () {
    var deferred = Q.defer();
    this.save(function(err,res){
      if (err) { deferred.reject(err); }
      else { deferred.resolve(res); }
    });
    return deferred.promise;
  },

  sendMessage : function (message) {
    var deferred = Q.defer();

    this.messages.push(message);
    this.save(function(err,res){
      if (err) { deferred.reject(err); }
      else { deferred.resolve(res); }
    });
    return deferred.promise;
  }
};


/**
 * Static functions
 */
ConversationSchema.statics = {

  load : function (id) {
    var deferred = Q.defer();
    this.findOne({_id : id})
    .populate('recipient')
    .populate('originator')
    .exec(function(err, res){
      if (err) { deferred.reject(err); }
      else { deferred.resolve(res); }
    });
   return deferred.promise;
 },

 loadSimple : function(id) {
   var deferred = Q.defer();
    this.findOne({_id : id})
    .exec(function(err, res){
      if (err) { deferred.reject(err); }
      else { deferred.resolve(res); }
    });
   return deferred.promise;
 }

};

mongoose.model('Conversation', ConversationSchema);
