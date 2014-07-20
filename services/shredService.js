var mongoose       = require('mongoose'),
_              = require('underscore'),
Shred         = mongoose.model('Shred'),
utils          = require('../libs/utils'),
TagsList       = mongoose.model('TagsList'),
query          = require('../libs/query.js'),
Q              = require('q'),
feedService    = require('./feedService'),
fileHandler    = require('../libs/fileHandler');


module.exports = {

    getById : function(id) {
        // returns a promise
        return Shred.load(id);
    },

    list : function () {
        // TODO: return a more approriate fetch
        return query.query(Shred, {populate : 'user'})
    },

    getManyRelated : function (shred) {
        var deferred = Q.defer();

        query.query(Shred, {populate : 'user'})
        .then( function(doc) {
            deferred.resolve({
                modelBS : shred,
                collBS : doc
            });
        })
        .fail(function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    },

    rate : function (user, shredId, rating) {
        var def = Q.defer();

        rating = parseInt(rating, 10);

        Shred.findSimple(shredId)
        .then(function(shred) {
            shred.rate(user, rating).then(def.resolve);
        });

        return def.promise;
    },

    comment : function (user, shredId, body) {
        var def = Q.defer();
        var shred;

        Shred.load(shredId)
        .then(function(res) {
            shred = res;
            shred.comments.push({
                body: body,
                user: user._id
            });
            return shred.saveOrUpdate(true);
        })
        .then(function(res) {
            return feedService.broadcastNewShredCommentFeed({
                shred : shred,
                user : user,
                body : body
            });
        })
        .then(def.resolve, def.reject).done();
        return def.promise;
    },

    promote : function (user, shredId, body) {
        var def = Q.defer(), shred;
        var promotion = {
            body : body,
            createdAt : new Date(),
            user : user._id
        };

        Shred.load(shredId)
        .then(function (res) {
            shred = res;
            shred.promotions.push(promotion);
            return shred.save();
        })
        .then(function () {
            return feedService.broadcastPromotionFeed({
                user : user,
                body : body,
                shred : shred
            });
        })
        .then(def.resolve, def.reject).done();
        return def.promise;
    },

    tryIncreaseView : function (req, shredId) {
        var def = Q.defer();

        // id is IP or userId
        var userId = utils.getUserOrIp(req);
        Shred.findSimple(shredId)
        .then(function(shred) {
            if (!shred.views) { shred.views = {}; }

            // if user hasnt seen this, increase view
            if ( !shred.views[userId] ) {
                shred.views[userId] = true;
                shred.markModified('views');
                shred.save(function(err, res) {
                    if ( err ) { def.reject(err); }
                    else { def.resolve(res); }
                });

            // or just return normally
            } else { def.resolve(shred);}
        }).done();

        return def.promise;
    },

    getShredsByUserId : function (id) {
        // returns a promise
        return Shred.getShredsByUserId(id);
    },

    create : function (data, user) {
        var def = Q.defer();
        var shred = new Shred(data);
        shred.user = user;

        // try and add new tags
        TagsList.appendTags({
            shredTags : data.shredTags,
            gearTags : data.gearTags
        });

        shred.create(function (err, doc) {
            if (err) { def.reject(err); }
            else { def.resolve(shred); }
        });
        return def.promise;
    },

    upload : function (req) {
        var def = Q.defer();
        var fileResult, shred;

        fileHandler.storeVideoFile(req, {thumb : true})
        .then(function(res) {
            fileResult = res;
            return Shred.load(req.params.id);
        })
        .then(function (res) {
            shred = res;
            shred.fileId = fileResult.file.name;
            shred.thumb = fileResult.thumb;
            return shred.save();
        })
        .then (function() {
            return feedService.broadcastNewShredFeed({
                shred : shred,
                user : req.user
            });
        })
        .then(function () {
            def.resolve(shred);
        })
        .fail(def.reject);
        return def.promise;
    },

    query : function (q) {
        var opts = {criteria : {}};
        opts.populate = 'user';

        if (q.q && q.q.length) {
            opts.criteria.title = {'$regex'  : new RegExp(q.q, 'gi')};
        }

        if ( q.tags && q.tags.length ) {
            if ( !_.isArray(q.tags) ) { q.tags = q.tags.split(','); }
            opts.criteria.tags = {'$in' : q.tags};
        }

        if ( q.location && q.location.length ) {
            opts.criteria.location = {'$regex'  : new RegExp(q.q, 'gi')};
        }

        if ( q.perPage ) { opts.perPage = q.perPage; }
        if ( q.page ) { opts.page = q.query.page; }
        if ( q.type ) { opts.criteria.type = q.type; }
        return query.query(Shred, opts);
    }
};
