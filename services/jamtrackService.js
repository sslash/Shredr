var mongoose    = require('mongoose'),
    Jamtrack    = mongoose.model('Jamtrack'),
    Q           = require('q'),
    query       = require('../libs/query.js'),
    fileHandler = require('../libs/fileHandler'),
    TagsList    = mongoose.model('TagsList');

module.exports = {

    findById : function (id) {
        return Jamtrack.findById(id);
    },

    list : function (opts) {
        var opts = opts || {};
        opts.populate = 'user';
        return query.query(Jamtrack, opts);
    },

    create : function (body, user) {
        var jamtrack = new Jamtrack(body);
        jamtrack.user = user;
        return jamtrack.create();
    },

    upload : function(req) {
        var def = Q.defer();

        fileHandler.storeAudioFile(req)
        .then(function(result) {
            Jamtrack.findById(req.params.id, function(err, doc) {
                // set unique name of file as a string on the jamtrack object
                doc.fileId = result.file.name;
                doc.save(function (err, res) {
                    if ( err ) { def.reject(err); }
                    else { def.resolve(res); }
                });
            });
        })
        .fail(def.reject);
        return def.promise;
    }
};
