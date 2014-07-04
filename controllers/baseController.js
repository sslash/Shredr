var Q    = require('q'),
mongoose = require('mongoose'),
User     = mongoose.model('User'),
path     = require('path'),
_        = require("underscore");

module.exports = {
    extend: function(child) {
        return _.extend({}, this, child);
    },

    render: function (req, res, opts) {
        user = req.user || {notLoggedIn : true};
        var fullBootstrap = {};
        _.extend(fullBootstrap, opts);

        // handlebars objects
        fullBootstrap.things = opts.things || opts.collBS || [];
        fullBootstrap.m = opts.modelBS || {};
        fullBootstrap.type = opts.type || '';

        // backbone objects
        fullBootstrap.userBS = JSON.stringify(user);
        fullBootstrap.collBS = !!opts.collBS ? JSON.stringify(opts.collBS) : '{}';
        fullBootstrap.modelBS = !!opts.modelBS ? JSON.stringify(opts.modelBS) : '{}';
        fullBootstrap.layout = '../layout';

        res.render(path.join( __dirname, '../app/templates/' + opts.tpl ), fullBootstrap);
    }
};
