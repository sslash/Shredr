/**
* Module dependencies.
*/
var mongoose   = require('mongoose'),
Shred          = mongoose.model('Shred'),
userService    = require('../services/userService'),
shredService   = require('../services/shredService'),
TagsList       = mongoose.model('TagsList'),
Jamtrack       = mongoose.model('Jamtrack'),
_              = require('underscore'),
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

    show : function (req, res) {
        shredService.getById(req.params.id)
        .then(shredService.getManyRelated)
        .then(function(result) {
            module.exports.render(req, res, _.extend(result, {
                type : 'shreds',
                tpl : 'shred/shredLayout'
            }));
        });
    },

    get : function(req, res) {
        shredService.getById(req.params.id)
        .then(client.send.bind(null, res, null));
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
                if (err) { next({}, err) }
                next(shreds);
            });
        });
    },


    /**
    * Create a Shred
    */
    create : function (req, res) {
        var shred = new Shred(req.body);
        shred.user = req.user;

        // try and add new tags
        TagsList.appendTags({
            shredTags : req.body.shredTags,
            gearTags : req.body.gearTags
        });

        shred.create(function (err, doc) {
            if (err) { client.error(res, err, 400); }
            else {

                // if jamtrack reference, save reference to this in the jamtrack too
                if ( req.body.jamtrackTag && req.body.jamtrackTag.length > 0 ) {

                    Jamtrack.findByTitle(req.body.jamtrackTag, function (err, jamtrack) {
                        if (err) { client.error(res, 'Jamtrack was not found', 400); }
                        else {
                            jamtrack.relatedShreds.push(doc);

                            // care if this fails.
                            jamtrack.save();
                        }
                    });
                }

                client.send(res, null, doc);
            }
        });
    },

    upload : function (req, res ) {
        fileHandler.storeVideoFile(req)
        .then(function(result) {
            Shred.findById(req.params.id, function (err, shred) {
                if (err) { client.error(res, 'Shred not found', 400); }
                else {
                    shred.fileId = result.file.name;
                    shred.save(client.send.bind(null, res));
                }
            });
        })
        .fail(function(err){
            client.error(res, err);
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
    },

    rate : function(req, res) {
        var rate = req.query.rating;
        if (!rate) {return res.json ({'error' : 'Rating not included'}, 500);}
        rate = parseInt(rate, 10);

        var user = req.user;
        if (!user) {return res.json ({'error' : 'User no logged in'}, 500);}

        var shredid = req.params.id;

        Shred.findById(shredid, function(err, shred) {
            if ( err ) {return res.json({}, 500);}
            if (!shred) { return res.json({error : 'shred with id ' + shredid + ' not found'}, 500); }
            shred.rate(user, rate, function(err, shred) {
                return res.json(shred);
            });
        });
    },

    comment : function(req, res) {
        var comment = req.body.comment;
        if (!comment) {return res.json ({'error' : 'Comment not included'}, 500);}
        var user = req.user;
        var shredid = req.params.id;

        Shred.findById(shredid, function(err, shred) {
            if ( err ) {return res.json({}, 500);}
            if (!shred) { return res.json({error : 'shred with id ' + shredid + ' not found'}, 500); }
            shred.addComment(user, comment, function(err, shred) {
                return res.json(shred);
            });
        });
    }
});
