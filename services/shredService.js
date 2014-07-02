var mongoose       = require('mongoose'),
_              = require('underscore'),
Shred         = mongoose.model('Shred'),
utils          = require('../libs/utils'),
TagsList       = mongoose.model('TagsList'),
query          = require('../libs/query.js'),
Q              = require('q'),
fileHandler    = require('../libs/fileHandler');


module.exports = {

    getById : function(id) {
        // returns a promise
        return Shred.findById(id);
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

        Shred.findSimple(shredId)
        .then(function(shred) {
            shred.comments.push({
                body: body,
                user: user._id
            });
            return shred.saveOrUpdate(true);
        })
        .then(def.resolve.bind(null));
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

        fileHandler.storeVideoFile(req, {thumb : true})
        .then(function(result) {
            Shred.findById(req.params.id)
            .then(function (shred) {
                shred.fileId = result.file.name;
                shred.thumb = './public/video/thumbs/' + result.thumb;
                shred.save(function(err, res){
                    if (err) { def.reject(err); }
                    else { def.resolve(shred); }
                });
            });
        })
        .fail(def.reject);
        return def.promise;
    },

    query : function (q) {
        var opts = {criteria : {}};
        opts.populate = 'user';
        if ( q.perPage ) { opts.perPage = q.perPage; }
        if ( q.page ) { opts.page = q.query.page };
        if ( q.type ) { opts.criteria.type = q.type };
        return query.query(Shred, opts);
    }
};
