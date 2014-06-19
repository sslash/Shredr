/**
 * Module dependencies.
 */
 var mongoose   = require('mongoose'),
    Conversation = mongoose.model('Conversation'),
    _          = require('underscore'),
    client = require('../libs/responseClient'),
    conversationService = require('../services/conversationService'),
    User = mongoose.model('User');

 /**
 * Create a Conversation
 */
 exports.create = function (req, res) {
  var conv = req.body;
  if ( !conv.recipient ) {
    client.error(res, {'Error' : 'Did not receive a receipent'});
  }

  conversationService.create(conv, req.user)
  .then(client.send.bind(null, res, null), client.error.bind(null, res))
  .done();
};

exports.get = function (req, res) {
  var id = req.params.id;
  Conversation.load(id)
  .then( function(doc) {
    return client.send(res, null, doc);
  })
  .fail( function (err) {
    return client.error(res, err);
  });
};

exports.sendMessage = function (req, res) {
  var id = req.params.id;
  var message = req.body.message;
  if (!message || !message.from || !message.body || message.body.lenght === 0) {
    return client.error(res, {'Error' : 'Did not reveice a recipient or message body'});
  }
  message.timestamp = new Date();
  var conversation = {};

  Conversation.loadSimple(id)
  // Send the message
  .then( function(conv){
    conversation = conv;
    return conv.sendMessage(message);
  })

  // get the current recipient (TODO!!)
  .then( function(conv) {
    var currRecipient = message.from === 0 ? conv.recipient : conv.originator;
    return User.loadSimple(currRecipient);
  })

  // send notification to recipient
  .then( function(user) {
    return user.addNotification({
      type : 1,
      body : 'New response message received from ' + req.user.username,
      referenceId : conversation._id.toString()
    });
  })

  // return
  .then( function() {
    return client.send(res, null, conversation);
  })
  .fail( function(err) {
    return client.error(res, err);
  });
};

// if (err) { client.error(res, err); }
//     else {
//       User.loadSimple(conv.recipient, function (err, res) {
//         if ( err ) { client.error(res,err); }
//         else {
//         }
//       });
//     }
