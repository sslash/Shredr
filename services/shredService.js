var mongoose       = require('mongoose'),
_              = require('underscore'),
Shred         = mongoose.model('Shred'),
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
        var deferred = Q.defer();

        query.query(Shred, {populate : 'user'})
        .then(deferred.resolve)
        .fail(deferred.reject);

        return deferred.promise;
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

        debugger

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

    tryIncreaseView : function (userOrIp, shredId) {
        var def = Q.defer();

        Shred.findSimple(shredId)
        .then(function(shred) {
            shred.tryIncreaseview(userOrIp).then(def.resolve);
        });

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

        fileHandler.storeVideoFile(req)
        .then(function(result) {
            Shred.findById(req.params.id)
            .then(function (shred) {
                shred.fileId = result.file.name;
                shred.save(function(err, res){
                    if (err) { def.reject(err); }
                    else { def.resolve(shred); }
                });
            });
        })
        .fail(def.reject);
        return def.promise;
    }
};
