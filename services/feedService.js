var mongoose = require('mongoose'),
    User     = mongoose.model('User'),
    q        = require('q'),
    _        = require('underscore');

/**
* Broadcast a feed message to relevant receivers
*
* Feed should be persisted in redis. However. as for now, its mongo
*/
module.exports = {

    broadcast : function (receivers, opts) {
        var feed = { timeCreated : new Date() };
        _.extend(feed,opts);

        // for each receiver, add feed
        var defers = receivers.map(function (rec) {
            return this.broadCastToReceiver(feed,rec);
        }.bind(this));

        return q.all(defers);
    },

    broadCastToReceiver : function (feed, receiver) {
        var def = q.defer();

        var user;
        if (receiver.user) {
            user = receiver.user.toString();
        }else {
            user = receiver._id.toString();
        }

        // fetches the user to send the feed to.
        // this should be avoided, ie req.user should have
        // properly populated fan property.
        User.loadSimple(user.toString())
        .then(function (user) {
            user.feed || (user.feed = []);
            user.feed.push(feed);
            user.markModified('feed');

            user.save(function(err, res) {
                if (err) { def.reject(err); }
                else { def.resolve(res); }
            });
        })
        .fail(def.reject).done();
        return def.promise;
    },

    /**
    * Example feed:
    *
    * 26.12.2012 - 10:55
    * "Mike(link) just challenged Crank(link) to a Battle(link)"
    * <Battle-type>
    * <Image of mike><Image of Crank>
    */
    broadcastNewBattleFeed : function (opts) {
        var user1, user2, def = q.defer(), dat = this;

        opts
        .populate(['battler', 'battlee'], function() {

            var baseFeed = {
                type : 'newBattle',
                referenceObj : {
                    id : opts._id.toString(),
                    battler : {
                        username : opts.battler.username,
                        id : opts.battler._id.toString(),
                        img : opts.battler.profileImgFile
                    },
                    battlee : {
                        username : opts.battlee.username,
                        id : opts.battlee._id.toString(),
                        img : opts.battlee.profileImgFile
                    }
                }
            };

            var feed1 = _.extend(baseFeed, {user : 'battler'});
            var feed2 = _.extend(baseFeed, {user : 'battlee'});

            q.all([
                dat.broadcast(opts.battler.fans, feed1),
                dat.broadcast(opts.battlee.fans, feed2)
            ]).then(def.resolve, def.reject).done();
        });

        return def.promise;
    },

    /**
    * Example feed:
    *
    * 26.12.2012 - 10:55
    * "Mike created a new Shred(link)"
    * <Image of mike>
    * <shred thumb>
    */
    broadcastNewShredFeed : function (opts) {
        var feed = {
            type : 'newShred',
            user : {
                img : opts.user.profileImgFile,
                username : opts.user.username,
                id : opts.user._id.toString()
            },
            referenceObj : {
                img : opts.shred.thumb,
                id : opts.shred._id.toString(),
                title : opts.shred.title
            }
        };

        // send to user.fans
        return this.broadcast(opts.user.fans, feed);
    },


    /**
    * TODO: Not sure if this works correctly.
    * Example feed:
    *
    * 26.12.2012 - 10:55
    * "Mike commented on Alex's shred (link)"
    * <Image of mike>
    * <comment body><shred thumb>
    */
    broadcastNewShredCommentFeed : function (opts) {
        var feed = {
            type : 'newShredComment',
            user : {
                img : opts.user.profileImgFile,
                username : opts.user.username,
                id : opts.user._id.toString()
            },
            referenceObj : {
                body : opts.body,
                id : opts.shred._id.toString(),
                thumb : opts.shred.thumb,
                user : {
                    id : opts.shred.user._id.toString(),
                    username : opts.shred.user.username
                }
            }
        }
        return this.broadcast(opts.user.fans, feed);
    },

    /**
    * Example feed:
    *
    * 25.12.122 - 10:55
    * "Andrew King just started using Shredr.
    * Take the time to welcome him"
    * <img of andrew>
    */
    broadcastNewUserFeed : function (opts) {
        var def = q.defer();

        var feed = {
            type : 'newUser',
            user : {
                img : opts.user.profileImgFile,
                username : opts.user.username,
                id : opts.user._id.toString()
            }
        };

        // broadcast to all users
        // TODO: find a better group of people to send to
        User.find({}).exec(function (err, users) {
            if ( err ) throw err;
            this.broadcast(users, feed)
            .then(def.resolve, def.reject).done();
        }.bind(this));
        return def.promise;
    },

    /**
    * Example feed:
    *
    * "Mike Promotes:"
    * "A Day In Life"
    * " - This one rox"
    * "By Andrew(link)"
    * <img of andrew>
    * <img of mike (sidebar)>
    */
    broadcastPromotionFeed : function (opts) {

        var feed = {
            type : 'newPromotion',
            user : {
                img : opts.user.profileImgFile,
                username : opts.user.username,
                id : opts.user._id.toString()
            },
            referenceObj : {
                id : opts.shred._id.toString(),
                thumb : opts.shred.thumb,
                title : opts.shred.title,
                body : opts.body,
                user : {
                    username : opts.shred.user.username,
                    id : opts.shred.user._id.toString(),
                    profileImgFile : opts.shred.user.profileImgFile
                },
            }
        };

        // broadcast to all users
        // TODO: find a better group of people to send to
        return this.broadcast(opts.user.fans, feed);
    },

    // TODO: this lack
    broadcastBattleCompletedFeed : function () {},
    broadcastNewFanFeed : function () {}
};
