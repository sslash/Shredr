var mongoose       = require('mongoose'),
Scale          = mongoose.model('Scale'),
TagsList       = mongoose.model('TagsList'),
query          = require('../libs/query.js'),
Q              = require('q');

module.exports = {

    create : function (scaleBody, user) {
        var def = Q.defer();
        var scale = new Scale(scaleBody);
        scale.user = user;

        // title of scale goes into the scale tags
        // dont care if it fails..
        TagsList.appendTags({
            shredTags : scaleBody.title,
        });

        scale.create(function (err, doc) {
            if (err) { def.reject(err); }
            else { def.resolve(scale); }
        });
        return def.promise;
    },

    list : function(id) {
        return query.query(Scale, {populate : 'user'});
    }
};
