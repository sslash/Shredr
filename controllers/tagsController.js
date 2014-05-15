var mongoose   = require('mongoose'),
    TagsList   = mongoose.model('TagsList'),
    client     = require('../libs/responseClient');

exports.getShredTags = function (req, res) {
    TagsList.getShredTags(client.send.bind(null, res));
};

exports.getGearTags = function (req, res) {
    TagsList.getGearTags(client.send.bind(null, res));
};
