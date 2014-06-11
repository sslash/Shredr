/**
* Module dependencies.
*/
var mongoose   = require('mongoose'),
Shred          = mongoose.model('Shred'),
shredService   = require('../services/shredService'),
Jamtrack       = mongoose.model('Jamtrack'),
_              = require('underscore'),
utils          = require('../libs/utils'),
client         = require('../libs/responseClient'),
fileHandler    = require('../libs/fileHandler'),
path           = require('path'),
query          = require('../libs/query.js'),
BaseController = require("./baseController");


module.exports = BaseController.extend({

    // var render : function (req, res, user) {
    //     user = user || {notLoggedIn : true};
    //
    //     list(req, function(shreds, err) {
    //         if ( err ) { console.log('err: ' + err); }
    //
    //         // TODO: base controller.render
    //         var fullBootstrap = {
    //             // user : user,
    //             userBS : JSON.stringify(user),
    //             modelBS : JSON.stringify({}),
    //             collBS : JSON.stringify(shreds),
    //             type : 'shreds',
    //             leftShreds : shreds.slice(0,14),
    //             rightShredsTop : shreds.slice(14,22),
    //             rightShredsBottom : shreds.slice(22,28),
    //             layout: '../layout'
    //         };
    //
    //         res.render(path.join( __dirname, '../app/templates/stage/stageShredsLayout' ), fullBootstrap);
    //     });
    // };

    /** RENDERS **/

    show : function (req, res) {
        shredService.getById(req.params.id)
        .then(shredService.getManyRelated)
        .then(function(result) {
            module.exports.render(req, res, _.extend(result, {
                type : 'shreds',
                things : _.first(result.collBS, 3),
                tpl : 'shred/shredLayout'
            }));
        })
        .fail(function(err) {
            console.log('failed: '  +err);
            return null;
        });
    },

    showStageView : function (req, res) {
        shredService.list()
        .then(function (shreds) {
            module.exports.render(req, res, {
                collBS : shreds,
                leftShreds : shreds.slice(0,14),
                rightShredsTop : shreds.slice(14,22),
                rightShredsBottom : shreds.slice(22,28),
                type : 'shreds',
                tpl : 'stage/stageShredsLayout'
            });
        })
        .fail(function(err) {
            console.log('err: ' + err);
        })
    },


    /** API ENDPOINTS **/

    get : function(req, res) {
        shredService.getById(req.params.id)
        .then(client.send.bind(null, res, null));
    },


    rate : function(req, res) {
        var userId = utils.getUserId(req),
        rate = req.query.rating, shredId = req.params.id;

        if ( !rate ) { return client.error(res, {'error' : 'Rating not included'}); }

        shredService.rate(userId, shredId, rate)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    },

    tryIncreaseView : function (req, res) {
        var userId = utils.getUserOrIp(req),
            shredId = req.params.id;
        shredService.tryIncreaseView(userId, shredId)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    },

    comment : function(req, res) {
        var comment = req.body.body;
        if (!comment) {return client.error(res, {'error' : 'Comment text not included' })}
        shredService.comment(req.user, req.params.id, comment)
        .then(client.send.bind(null, res, null), client.error.bind(null, res));
    },

    /**
    * List
    */
    list : function(req, next){
        var page = req.param('page');
        if ( !page ) { page = 1;}
        page = (page > 0 ? page : 1) - 1;
        var perPage = 32;
        var options = {
            perPage: perPage,
            page: page,
            populate : 'user'
        };

        Shred.list(options, function(err, shreds) {

            if ( err ) { next({}, err); }

            Shred.count().exec(function (err, count) {
                if (err) { next({}, err); }
                next(shreds);
            });
        });
    },


    /**
    * Create a Shred
    */
    create : function (req, res) {
        shredService.create(req.body, req.user)
        .then(client.send.bind(null, res, null))
        .fail(function(err) {
            console.log('error! ' + err);
        });
    },

    upload : function (req, res ) {
        shredService.upload(req)
        .then(client.send.bind(null, res, null))
        .fail(function(err) {
            console.log('error! ' + err);
        });
    },

    /**
    * Update shred
    */
    update : function(req, res){
        var shred = req.shred;
        shred = _.extend(shred, req.body);

        shred.save(function(err) {
            if (!err) {
                return res.render(shred);
            }else{
                return res.sender({}, 400);
            }
        });
    },


    /**
    * Delete a Shred
    */
    destroy : function(req, res){
        var shred = req.shred;
        shred.remove(function(err){
            res.render({}, 200);
        });
    },

    /**
    * Find by Id. Used by other controllers
    */
    findById : function(req, res, next, id){
        var User = mongoose.model('User');

        Shred.findById(id, function (err, shred) {
            if (err) { return next(err); }
            if (!shred) { return next(new Error('not found')); }
            req.shred = shred;
            next();
        });
    },

    query : function (req, res) {
        var opts = {criteria : {}}, q = req.query;
        if ( q.perPage ) { opts.perPage = q.perPage; }
        if ( q.page ) { opts.page = q.query.page };
        if ( q.type ) { opts.criteria.type = q.type };
        return query.query(Shred, opts, res);
    }
});
