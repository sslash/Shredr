var mongoose       = require('mongoose'),
    _              = require('underscore'),
    Shred         = mongoose.model('Shred'),
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

        query.query(Shred)
        .then(deferred.resolve)
        .fail(deferred.reject);

        return deferred.promise;

    },

    getManyRelated : function (shred) {
        var deferred = Q.defer();

        query.query(Shred)
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
};
