var mongoose   = require('mongoose'),
   Conversation = mongoose.model('Conversation'),
    Q           = require('q'),
    User = mongoose.model('User'),
    query       = require('../libs/query.js');

module.exports = {

    create : function (conv, user) {
        var def = Q.defer();
        conv.originator = user;
        var conversation = new Conversation(conv);
        conversation.create()
        .then(function(doc) {
            return User.loadSimple(conv.recipient);
        })
        .then( function(recepient) {
          return recepient.addNotification({
            type : 1,
            body : 'New message received from ' + user.username,
            referenceId : conversation._id.toString()
          });
        })
        .then( function(doc) {
            def.resolve(conversation);
        })
        .fail( function (err) {
          def.reject(err);
      }).done();

      return def.promise;
    }
};
