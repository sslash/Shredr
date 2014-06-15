var mongoose   = require('mongoose'),
    client = require('../libs/responseClient'),
    fileHandler = require('../libs/fileHandler'),
    jamtrackService   = require('../services/jamtrackService'),
    Jamtrack      = mongoose.model('Jamtrack');

BaseController = require("./baseController");


module.exports = BaseController.extend({
    create : function (req, res) {
        jamtrackService.create(req.body, req.user)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    },

    upload : function(req, res) {
        jamtrackService.upload(req)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    },

    get : function (req, res) {
          Jamtrack.findById(req.params.id, client.send.bind(null, res));
    },

    list : function (req, res) {
        jamtrackService.list(req.query)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    }
});
