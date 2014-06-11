
var mongoose   = require('mongoose'),
utils          = require('../libs/utils'),
client         = require('../libs/responseClient'),
scaleService   = require('../services/scaleService'),
BaseController = require("./baseController");


module.exports = BaseController.extend({

    create : function (req, res) {
        scaleService.create(req.body, req.user)
        .then(client.send.bind(null,res,null))
        .fail(function(err) {
            console.log('error! ' + err);
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
