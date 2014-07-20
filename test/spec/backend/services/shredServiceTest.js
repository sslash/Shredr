require('../setup');
var superagent     = require('superagent');
var q              = require('q');
var expect         = require('expect.js');
var rewire         = require('rewire');
var mongoose       = require('mongoose');
Shred              = mongoose.model('Shred');

var shredService = rewire(process.cwd() + '/services/shredService');


function diFileHandler () {
    shredService.__set__('fileHandler', {
        storeVideoFile : function() {
            return q.fcall(function () {
                return {
                    thumb : 'tn_11.5785s.jpg',
                    file : {name : './public/video/s.mp4'}
                };
            })
        }
    });
}

describe('shredService', function () {

    before(diFileHandler);

    it ('should be defined', function () {
        expect(shredService).to.be.ok();
    });

    describe('upload', function() {

        it ('should call broadcastNewShredFeed with shred', function (done) {
            var optsToBroadcast, shredId = '53bd65419b4e75db761faba0', userId = '1337';

            shredService.__set__('feedService', {
                broadcastNewShredFeed : function (opts) {
                    return q.fcall(function() {
                        optsToBroadcast = opts;
                    });
                }
            });

            shredService.upload({
                params : { id : shredId },
                user : { _id : userId }
            })
            .then(function () {
                expect(optsToBroadcast.shred._id.toString()).to.equal(shredId);
                expect(optsToBroadcast.user._id).to.equal(userId);
                done();
            }).fail(console.log).done();
        });
    });
});
