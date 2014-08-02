var mongoose       = require('mongoose'),
    Badge          = mongoose.model('Badge'),
    _              = require('underscore'),
    Q              = require('q');

module.exports = {

    // resolves the populated badge
    addBadgeForUser : function (title, user) {
        var def = Q.defer();
        user.badges = user.badges || [];
        Badge.findOne({title : title}, function (err, res) {
            if (err) return def.reject(err);
            user.badges.push(res);
            def.resolve(res);
        });
        return def.promise;
    }
};
