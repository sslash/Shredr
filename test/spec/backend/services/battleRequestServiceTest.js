require('../setup');
var superagent     = require('superagent');
var q              = require('q');
var expect         = require('expect.js');
var rewire         = require('rewire');
var brService = rewire(process.cwd() + '/services/battleRequestService');
var testHelper    = require('../testHelper');
var brId;

describe('battleRequestService', function () {

    before(function(done) {
        testHelper.createBattleRequest(function(id) {
            brId = id;
            done();
        });
    });

    after(testHelper.deleteBattle);

    it ('should be defined', function () {
        expect(brService).to.be.ok();
    });


    // TODO: verify this works
    describe('accept', function () {
        it('should call broadcastFeed to all fans of battler and battlee', function (done) {
            proxybroadcastNewBattleFeed(function (opts) {
                // verify correct args
                expect(opts.statement).to.equal('test yolo battle');
                expect(opts.mode).to.equal('simple');
                expect(opts.battler).to.be.ok();
                expect(opts.battlee).to.be.ok();
                done();
            });

            brService.acceptBattleRequest(brId)
            .fail(function(err) {
                console.log('err: ' + err);
            })
        });
    });
});


function proxybroadcastNewBattleFeed (cb) {
    brService.__set__('feedService', {
        broadcastNewBattleFeed : cb
    });
}
