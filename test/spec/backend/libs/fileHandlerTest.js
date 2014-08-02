var superagent     = require('superagent');
var q              = require('q');
var expect         = require('expect.js');
var fileHandler    = require(process.cwd() + '/libs/fileHandler');

describe('fileHandler', function () {
    describe('createMergedBattleFile', function () {

        it('should save initial battle advanced file', function (done) {
            fileHandler.saveInitialBattleAdv({}, {
                filepath : process.cwd() + '/public/video/battle/',
                file1 : 'sap2.mp4',
                file2 : 'sap22.mp4',
                outputfile : 'theWholeVid.mp4',
                duration : 12.5,
                start : 2.4,
                audio : process.cwd() + '/public/audio/scrb1_claptonsmoky_jt.mp3'
            })
            .then(function(res) {
                console.log('res: ' + res);
                done();
            })
            .fail(function(err) {
                console.log('err: ' + err);
                throw err;
            });
        });

        xit('should merge two files', function (done) {
            fileHandler.createMergedBattleFile({}, {
                file3 : 'sap3.mp4',
                filepath : process.cwd() + '/public/video/battle/',
                file2 : 'sap2.mp4',
                file1 : 'theWholeVid.mp4',
                duration : 10.5,
                start : 3.2
            })
            .then(function(res) {
                console.log('res: ' + res);
                done();
            })
            .fail(function(err) {
                console.log('err: ' + err);
                throw err;
            });
        });
    });
});
