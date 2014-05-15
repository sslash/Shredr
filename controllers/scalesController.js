/**
 * Module dependencies.
 */
 var mongoose   = require('mongoose'),
     client = require('../libs/responseClient'),
     query = require('../libs/query.js'),
     Scale      = mongoose.model('Scale');

 exports.create = function (req, res) {
  var scale = new Scale(req.body);
  scale.user = req.user;

  scale.create(function (err, doc) {
      return client.send(res, err, doc);
  });
};

exports.query = function (req, res) {
    var opts = req.query || {};
    return query.query(Scale, query, opts, res);
};

exports.get = function (req, res) {
      Scale.findById(req.params.id, client.send.bind(null, res));
};
