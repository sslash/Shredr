/**
* Module dependencies.
*/
var mongoose   = require('mongoose'),
    client = require('../libs/responseClient'),
    query = require('../libs/query.js'),
    fileHandler = require('../libs/fileHandler'),
    Jamtrack      = mongoose.model('Jamtrack');

exports.create = function (req, res) {
    var jamtrack = new Jamtrack(req.body);
    jamtrack.user = req.user;

    jamtrack.create(function (err, doc) {
        return client.send(res, err, doc);
    });
};

exports.upload = function(req, res) {
    fileHandler.storeAudioFile(req)
    .then(function(result) {
        Jamtrack.findById(req.params.id, function(err, doc) {
            // set unique name of file as a string on the jamtrack object
            doc.fileId = result.file.name;
            doc.save(client.send.bind(null, res));
        });
    })
    .fail(function(err) {
        client.error(res, err);
    });
}

exports.get = function (req, res) {
      Jamtrack.findById(req.params.id, client.send.bind(null, res));
};

exports.query = function (req, res) {
    var opts = req.query || {};
    opts.populate = 'user';
    return query.query(Jamtrack, opts, res);
};
