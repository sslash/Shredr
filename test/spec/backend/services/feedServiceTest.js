require('../setup');
var superagent     = require('superagent');
var q              = require('q');
var expect         = require('expect.js');
var mongoose       = require('mongoose');
var Shred          = mongoose.model('Shred');
var User           = mongoose.model('User');
var _              = require('underscore');
var testHelper     = require('../testHelper');

var brService = require(process.cwd() + '/services/battleRequestService');
var shredService = require(process.cwd() + '/services/shredService');
var userService = require(process.cwd() + '/services/userService');
var feedService = require(process.cwd() + '/services/feedService');
var dat = this;

describe('feedService', function () {


    if('should be defined', function () {
        expect(feedService).to.be.ok();
    });

    describe('broadcastNewShredFeed', function () {
        beforeEach(fetchShredAndUser);
        afterEach(function(done) {
            clearTestFeeds(clearBattleStuff.bind(null,done));
        });

        it('should broadcast to all fans' , function (done) {
            var shred = _.extend(dat.shred, {title : 'ey yo dis iz test yall'});
            var feedsLen;

            feedService.broadcastNewShredFeed({
                shred : shred,
                user : dat.user
            })

            // verify result is correct in DB
            .then(function () {

                // fetch user. loop through fanees. fetch fanee. expect to have that new feed. then clear feed
                fetchUser()
                .then(function() {
                    feedsLen = dat.user.fans.length;
                    var count = 0;
                    dat.user.fans.forEach(function(fan) {
                        User.loadSimple(fan.user.toString())
                        .then(function (user) {
                            var lastFeed = user.feed[user.feed.length-1];
                            expect(lastFeed.referenceObj.title).to.equal('ey yo dis iz test yall');

                            if ( ++count === feedsLen ) { done(); }
                        });
                    });
                });
            })
            .fail(function(e) {
                throw e;
            }).done();
        });
    });

    describe('broadcastNewBattleFeed', function () {
        var brId;

        before(function(done) {
            testHelper.createBattleRequest(function(id) {
                brId = id;
                done();
            });
        });
        after(testHelper.deleteBattle);

        it('should broadcast to all fans of battler and battlee', function (done) {

            // precondition
            testHelper.getFanUsers(function(fans){

                fans.forEach(function(fan) {
                    expect(fan.feed.length).to.equal(0);
                });

                // now the test
                brService.acceptBattleRequest(brId)
                .then(function () {
                    testHelper.getFanUsers(function(fans) {
                        fans.forEach(function(fan) {
                            expect(fan.feed.length).to.be.within(1, 2);
                            var lastFeed = fan.feed[fan.feed.length-1];
                            expect(lastFeed.type).to.equal('newBattle');
                            expect(lastFeed.referenceObj.id).to.be.ok();
                            expect(lastFeed.referenceObj.battler.username).to.equal('testuser2');
                            expect(lastFeed.referenceObj.battlee.username).to.equal('testuser');
                        });
                        done();
                    });
                }).fail(console.log).done();
            });

        });
    });

    describe('broadcastNewShredComment', function () {
        before(fetchShredAndUser);
        after(clearComments);

        it('should broadcast to all fans of commenter', function (done) {
            shredService.comment(dat.user, dat.shred._id.toString(), 'alo alo this neat comment')
            .then(function () {
                testHelper.getFanUsers(function(fans) {
                    fans.forEach(function(fan) {

                        var lastFeed = fan.feed[fan.feed.length-1];
                        expect(lastFeed.type).to.equal('newShredComment');
                        expect(lastFeed.user.username).to.equal('testuser');
                        expect(lastFeed.referenceObj.body).to.equal('alo alo this neat comment');

                        // comments on his own. for simplicity (laziness)
                        expect(lastFeed.referenceObj.user.username).to.equal('testuser');
                    });
                    done();
                });
            }).fail(console.log).done();
        });
    });

    // TODO: get this test to work
    // describe('broadcastNewUser', function () {
    //     before(fetchShredAndUser);
    //
    //     it('should broadcast to all users', function (done) {
    //         userService.create({
    //             username : 'yolo swagger',
    //             email : 'sapdapyolomap@mail.com',
    //             provider : 'test'
    //         })
    //         .then(function () {
    //             User.find().exec(function(err, users) {
    //                 if (err) throw err;
    //                 users.forEach(function (user) {
    //                     var lastFeed = user.feed[user.feed.length];
    //                     expect(lastFeed.type).to.equal('newUser');
    //                     expect(lastFeed.user.username).to.equal('yolo swagger');
    //                     expect(lastFeed.user.email).to.equal('sapdapyolomap@mail.com');
    //
    //                     // clean up
    //                     user.update({feed : []}).exec(function() {});
    //                 });
    //             });
    //
    //             User.remove({'username' : 'yolo swagger'}, function (err) {
    //                 if (err) throw err;
    //                 done();
    //             });
    //
    //         }).fail(console.log).done();
    //     });
    // });

    
});



function fetchShredAndUser (done) {
    q.all([fetchShred(), fetchUser()])
    .then(function () {
        done();
    })
    .fail( function (e) { throw e; } ).done();
}

function clearComments(done) {
    Shred.findOne({_id : '53bd65419b4e75db761faba0'}, function (err, shred) {
        if (err) { throw err; }
        shred.update({comments : []}, function() {
            done();
        })
    })
}

// these functions do fetches and sets the model objects on this instance
function fetchShred () {
    return doFetch(Shred, '53bd65419b4e75db761faba0', 'shred');
}

// "username" : "testuser"
function fetchUser () {
    return doFetch(User, '53bd646c9b4e75db761fab9e', 'user');
}

function clearTestFeeds (next) {
    fetchUser()
    .then(function() {
        feedsLen = dat.user.fans.length;
        var count = 0;
        dat.user.fans.forEach(function(fan) {
            User.loadSimple(fan.user.toString())
            .then(function (user) {
                user.update({feed : []}, function(err,res) {
                if ( ++count === feedsLen ) {
                        next();
                    }
                });
            });
        });
    });
}

function clearUser (user) {
    var def = q.defer();
    user.update({notifications : [], battles : []},
        function(err, res) {
            if(err) {throw err;}
                def.resolve(res);
        });
    return def.promise;
}

function clearBattleStuff(done) {
    User.findOne({'username' : 'testuser'}, function(err, user) {
        clearUser(user)
        .then(function() {
            User.findOne({'username' : 'testuser2'},function(err, user) {
                clearUser(user).then(function() {
                    done();
                });
            });
        });
    });
}

function doFetch(Model, id, objName) {
    var def = q.defer();
    Model.load(id)
    .then(function(res) {
        dat[objName] = res;
        def.resolve(res);
    })
    .fail(def.reject).done();

    return def.promise;
}
