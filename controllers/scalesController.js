
var mongoose   = require('mongoose'),
utils          = require('../libs/utils'),
client         = require('../libs/responseClient'),
scaleService   = require('../services/scaleService'),
BaseController = require("./baseController");


module.exports = BaseController.extend({

    create : function (req, res) {
        var scale = new Scale(req.body);
        scale.user = req.user;

        scale.create(function (err, doc) {
            return client.send(res, err, doc);
        });
    },

    list : function (req, res) {
        scaleService.list().then(client.send.bind(null,res, null));
    },

    get : function (req, res) {
        scaleService.get()
        Scale.findById(req.params.id, client.send.bind(null, res));
    }
});
