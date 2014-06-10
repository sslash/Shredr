var mongoose       = require('mongoose'),
Scale          = mongoose.model('Scale'),
TagsList       = mongoose.model('TagsList'),
query          = require('../libs/query.js'),
Q              = require('q');

module.exports = {

    list : function(id) {
        return query.query(Scale);
    }
};
