var fs  = require('fs'),
  path  = require('path'),
  q     = require('q'),
  _     = require('underscore'),
  async = require('async'),
  ffmpeg = require('fluent-ffmpeg');

// simple helper..
function done (deferred, err, res) {
    console.log('So Done. errs? ' + err);
    if (err) deferred.reject(err);
    else deferred.resolve(res);
}

function errorMsg (next, e, sap, errorMsg) {
    console.log('ffmpeg error: ' + e);
    next(errorMsg || e);
}


/**
*   INITIAL BATTLE ROUND ADVANCED
*
* - Store current file as currentFile
* - Create padding video to padFile
* - Merge currentFile with padFile and give it mergedName
* - Merge with audio and give it mergedAudioFile
* - use mergedAudioFile as inputToPlayables and
    store with different formats to playableName
* - delete currentFile, padFile, mergedAudioFile
*/
module.exports.createInitialBattleAdvanced = function (args) {
    var def = q.defer();
    var baseName = args.path + args.filename;

    _.extend(args, {
        currentFile : baseName + '_curr.mp4',
        padFile : baseName + '_pad.m4v',
        start : parseFloat(args.startSec + '.' + args.startFrame,10),
        mergedFile : baseName + '_merged.mp4',
        mergedAudioFile : baseName + '_mergedAudio.mp4',
        playableFile : baseName + '_playable',
        audioFile : args.audioFilepath + args.audioFilename
    });

    args.merge1File = args.padFile;
    args.merge2File = args.currentFile;
    args.inputToPlayableFiles = args.mergedAudioFile;

    async.waterfall([
        validateVideo.bind(null, args),
        storeFile,
        createPadVideo,
        mergeFiles,
        mergeAudio,
        createPlayableFiles,
        deleteFiles.bind(null, [])
    ],done.bind(null, def));

    return def.promise;
}

/**
*   INITIAL BATTLE ROUND SIMPLE
*
* - Store current file as mergedName
* - take mergedName and store with different formats to playableName
*/
module.exports.createInitialBattleSimple = function (args) {
    var def = q.defer();
    var baseName = args.path + args.filename;

    _.extend(args, {
        currentFile : baseName + '_merged.mp4',
        playableFile : baseName + '_playable'
    });

    // store this copy, as its being saved in the battlerequest obj!
    args.mergedFile = args.currentFile;
    args.inputToPlayableFiles = args.currentFile;

    async.waterfall([
        validateVideo.bind(null, args),
        storeFile,
        createPlayableFiles,

        // dont delete this, as its the merged file
        deleteFiles.bind(null, [args.currentFile])
    ], done.bind(null, def));

    return def.promise;
}


/**
*   SAVE BATTLE ROUND - Advanced and Simple
*
* - Store current file as currentFile
* - Seek into previous mergedName, output to afterSeekFile

* - if advanced, merge afterSeek with audio and give it mergedAudioFile
* - if mergedAudioFile, take that, else take afterSeek
    and store with different formats to playableFile
*   rename afterSeekFile to mergedFile
* - delete currentFile, mergedAudioFile
*/
module.exports.saveBattleRound = function (args) {

    var def = q.defer();

    // todo: use baseName here later
    args.baseName = args.path + args.filename;
    console.log('base; ' + args.baseName);

    _.extend(args, {
        currentFile : args.baseName + '_curr.mp4',
        start : parseFloat(args.startSec + '.' + args.startFrame,10),
        afterSeekFile : args.baseName + '_seeked.mp4',
        mergedAudioFile : args.baseName + '_mergedAudio.mp4',
        playableFile : args.baseName + '_playable',
        tmpMerge : args.baseName + '_tmp.mp4'
    });

    // merge audio expects mergedFile as input
    args.mergedFile = args.afterSeekFile;
    // args.inputToPlayableFiles = args.mergedAudioFile;

    // args.audioFile = args.audioFilepath + args.audioFilename;
    var commands = [
        storeFile.bind(null, args),
        seekAndMerge
    ];

    // var commands = [
    //     validateVideo.bind(null, args),
    //     storeFile,
    //     seekAndMerge,
    //     mergeAudio,
    //     createPlayableFiles,
    //     renameSeek,
    //     deleteFiles.bind(null, [])
    // ];

    if ( args.mode === 'Advanced' ) {

        args.audioFile = args.audioFilepath + args.audioFilename;
        commands.push(mergeAudio);
        args.inputToPlayableFiles = args.mergedAudioFile;

    } else {
        args.inputToPlayableFiles = args.afterSeekFile;
    }

    commands.push(
        createPlayableFiles,
        renameSeek,
        deleteFiles.bind(null, [])
    );

    async.waterfall(commands, function (err, res) {
        if (err) def.reject(err);
        else def.resolve(res);
    });

    return def.promise;
};


// HELPERS!

function renameSeek (args, next) {
    fs.rename(args.afterSeekFile, args.prevMergedFile, function (err, res) {
        if (err) next(err);
        else next(null, args);
    });
};

function seekAndMerge (args, next) {
    new ffmpeg(args.prevMergedFile)
    .duration(args.start)
    .on('error', errorMsg.bind(null, next))
    .on('end', onDurDone)
    .save(args.tmpMerge);

    function onDurDone () {
        new ffmpeg(args.tmpMerge)
        .input(args.currentFile)
        .on('error', errorMsg)
        .on('end', function() {
            console.log('Seek and merge done');
            next(null, args);
        })
        .mergeToFile(args.afterSeekFile);
    }
}


function createPlayableFiles (args, next) {
    var filetype = path.extname(args.initialFile);

    var command = new ffmpeg(args.inputToPlayableFiles)
    .output(args.playableFile + '.mp4')

    if ( filetype !== '.webm' ) {
        command = command.output(args.playableFile + '.webm')
        .withVideoCodec('libvpx')
        .withAudioCodec('libvorbis')
        .size('640x480')
        // .autopad()
        .withAudioQuality(4)
        .toFormat('webm');
    }

    command.on('end', function() {
        // final output to store is now:
        // to play: args.playableFile
        // to merge later: args.mergedFile
        args.playableFile = path.basename(args.playableFile, path.extname(args.playableFile));
        args.mergedFile = path.basename(args.mergedFile, path.extname(args.mergedFile));
        console.log('Finished playable files ' + args.playableFile);
        next(null, args);
    })
    .on('error', function(e) {
        console.log('Error: ' + e); next(e);
    })
    .run();
};

// adds audio to the given video
function mergeAudio (args, next) {

    new ffmpeg()
    .addInput(args.audioFile)
    .addInput(args.mergedFile)
    .audioChannels(4)
    .complexFilter('[0:a][1:a]amerge, pan=stereo:c0<c0+c2:c1<c1+c3[out]')
    .outputOptions(['-map 1:v', '-map [out]', '-c:v copy', '-c:a libfdk_aac'])
    .save(args.mergedAudioFile)
    .on('error', function(e) {
        console.log('Error: ' + e); next(e);
    })
    .on('end', function () {
        console.log('Done Audio');
        next(null, args);
    });
};

function createPadVideo (args, next) {
    var padImg = process.cwd() + '/public/img/icons/vidthmb.jpg';

    try {
        var command = new ffmpeg(padImg)
        .loop(args.start || 0)
        // using 25 fps
        .fps(25)
        .complexFilter('aevalsrc=0')
        .size('640x480')

        .on('error', function(e) {
            console.log('Error: ' + e); next(e);
        })
        .on('end', function (res) {
            console.log('Create Pad Done');
            next(null, args);
        })
        .save(args.padFile);
    } catch(e) {
        console.log('Err padding: ' + e); next(e);
    }
};

function mergeFiles (args, next) {
    new ffmpeg({source : args.merge1File})
    .input(args.merge2File)
    .mergeToFile(args.mergedFile, process.cwd() + '/uploads')
    .on('error', function(e) {
        console.log('Merge error: ' + JSON.stringify(e));
        next(e);
    })
    .on('end', function() {
        console.log('Merge finito!');
        next(null, args);
    });
}

function storeFile (args, next) {

    // get the temporary location of the file
    var tmp_path = process.cwd() + '/' + args.file.path;

    // store it in the new directory
    var initialFile = args.path + args.filename + path.extname(args.file.name);

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, initialFile, function(err) {
        if (err) { next(err); }

        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {

                // format the video to a fixed format
                new ffmpeg(initialFile)
                .size('640x480')
                // .autopad()
                .output(args.currentFile)
                .on('end', function() {
                    console.log('Store file done');
                    args.initialFile = initialFile;
                    next(null, args);
                })
                .on('error', function(e) {
                    console.log('Error: ' + e);
                     next(e);
                })
                .run();
        });
    });
}

function deleteFiles (skips, args, next) {
    console.log('hei yeall')

    function deleteFile (file) {
        return function (nextDel) {
            if (!file) return nextDel();
            console.log('Deleting: ' + file);
            fs.unlink(file, function (err) {
                if (err) nextDel(err);
                else nextDel();
            });
        };
    }

    var deleteFilesList = [
        args.initialFile,
        args.currentFile,
        args.padFile,
        args.tmpMerge,
        args.mergedAudioFile
     ];

     skips.forEach(function (s) {
        deleteFilesList.splice(deleteFilesList.indexOf(s), 1);
    });

    async.waterfall(deleteFilesList.map(deleteFile), function (err, res) {
        if (err) {
            next(err);
        } else {
            next(null, args);
        }
     });
}

function validateVideo (args, next) {
    var file = args.file;
    var size = file.size;
    size /= (1000*1000);

    // Do some error handling
    if ( size > 100) {
        // max size = 10Mb
        next({err :'File too large'});

    } else if ( !((/^video/).test(file.type)) ) {
        // must be video file
        next({err :'File is not a video file'});
    } else {
        next(null, args);
    }
};
