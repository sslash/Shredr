  var fs    = require('fs'),
    path  = require('path'),
    Q     = require('q'),
    _       = require('underscore'),
    async = require('async'),
    ffmpeg = require('fluent-ffmpeg'),
    vidDir = './public/video/',

    // stored in mongo
    thumbDir = '/video/thumbs/';

    // Stored on hdd
// var thumbDirStore =  './public' + thumbDir;


module.exports.storeFile = function (args, next) {

    // get the temporary location of the file
    var tmp_path = process.cwd() + '/' + args.file.path;

    // store it in the new directory
    var outputFile = args.path + args.filename + path.extname(args.file.name);

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, outputFile, function(err) {
        if (err) {
            console.log("Error saving file! " + JSON.stringify(err));
            next(err);
        }
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                //throw err;
                console.log('error saving file! ' + err);
                next(err);
            } else {

                // format the video to a fixed format
                var command = new ffmpeg(outputFile)
                .output(args.out_file)
                .withSize('672x384')
                .on('end', function() {
                    console.log('File Saved: ' + outputFile);
                    args.file1 = outputFile;
                    next(null, args);
                })
                .on('error', function (err) {
                    console.log('outerr: ' + err);
                    next(err);
                })
                .run();
            }
        });
    });
};

module.exports.saveInitialBattleSimple = function (args) {
    var def = Q.defer();
    _.extend(args, {
        out_file : args.path + args.filename + '_out.mp4',
        done_file : args.path + args.filename + '_done'
    });

    async.waterfall([
        this.storeFile.bind(null, args),
        // writes thumbs/filename
        this.createThumbnail,
        // verifies > 5mb
        this.validateVideo,
        // writes done_file.mp4 and done_file.webm -> takes out_file
        this.outputFile,
        // deletes all but done_file
        this.deleteFiles
    ], function (err, res) {
        console.log('Finished simple!');
        if (err) def.reject(err);
        else def.resolve(res);
    });

    return def.promise;
};

module.exports.saveInitialBattleAdv = function (args) {
    var def = Q.defer();
    _.extend(args, {
        audioFile : args.audioFilepath + args.audioFilename,
        start : parseFloat(args.startSec + '.' + args.startFrame,10),
        pad_file : args.path + args.filename + '_pad.m4v',
        out_file : args.path + args.filename + '_out.mp4',
        merge_file : args.path + args.filename + '_merge.mp4',
        after_audio_file : args.path + args.filename + '_waudio.mp4',
        done_file : args.path + args.filename + '_done'
    });

    async.waterfall([
        // writes file1 and out_file -> formats 672x384
        this.storeFile.bind(null, args),

        // writes thumbs/filename
        // this.createThumbnail,

        // verifies > 5mb
        this.validateVideo,

        // writes pad_file -> video of image
        this.createInitialPadVideo,

        // writes merge_file -> merge out_file and pad_file
        this.doMerge,

        // writes after_audio_file -> adds audioFile to merge_file
        this.addAudio,

        // writes done_file.mp4 and done_file.webm -> takes after_audio_file
        this.outputFile,

        // deletes all but done_file
        this.deleteFiles.bind(null, [])
    ], function (err, res) {
        if (err) def.reject(err);
        else def.resolve(res);
    });

    return def.promise;
};


module.exports.createMergedBattleFile = function (args) {
    var def = Q.defer();
    _.extend(args, {
        start : parseFloat(args.startSec + '.' + args.startFrame,10),

        // for store file
        filename : args.sourceFilename + '_tmp',
        out_file : args.path + args.sourceFilename + '_out.mp4',

        // input merge and ^ is 2.input
        pad_file : args.path + args.sourceFilename + '.mp4',

        // output to merge
        merge_file : args.path + args.sourceFilename + '_merge.mp4',

        // input to outputFile
        after_seek_file : args.path + args.sourceFilename + '_merge.mp4',

        // outout to outputFile, which overwrites sourceFilename
        done_file : args.path + args.sourceFilename
    }),

    async.waterfall([
        // writes file1 and out_file -> formats 672x384
        this.storeFile.bind(null, args),

        // verifies > 5mb
        this.validateVideo,
        // TODO: SEEK
        this.doMerge,
        this.outputFile,

        // dont delete pad_file, cause we are now overwriting!
        this.deleteFiles.bind(null, [args.pad_file])
    ], function (err, res) {
        if(err) def.reject(err);
        else def.resolve(res);
    });


    return def.promise;
}

module.exports.deleteFiles = function (skips, args, next) {

    function deleteFile (file) {
        return function (next) {
            if (!file) return next();
            console.log('Deleting: ' + file);
            fs.unlink(file, function (err) {
                if (err) next(err);
                else next();
            });
        };
    }

    var deleteFilesList = [
        args.file1,
        args.out_file,
        args.pad_file,
        args.merge_file,
        args.after_audio_file
     ];

     skips.forEach(function (s) {
        deleteFilesList.splice(deleteFilesList.indexOf(s), 1);
    });

    async.waterfall(deleteFilesList.map(deleteFile), function (err, res) {
        if (err) { next(err); }
        else next(null, args);
     });
}

module.exports.validateVideo = function (args, next) {
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

// sets start and end time to given movie.
module.exports.createInitialPadVideo = function (args, next) {
    var outputfile = args.pad_file;
    console.log('start: ' + args.start);

    try {
        var command = new ffmpeg(process.cwd() + '/public/img/icons/vidthmb.jpg')
        .loop(args.start)
        // using 25 fps
        .fps(25)
        .complexFilter('aevalsrc=0')

        .on('error', next)
        .on('end', function (res) {
            console.log('New duration done');
            next(null, args);
        })
        .save(outputfile)
    }catch(e) {
        console.log('err new duration: ' + e); next(e);
    }
};


module.exports.outputFile = function (args, next) {
    var filetype = path.extname(args.done_file);
    var newFilename = args.done_file;

    var command = new ffmpeg(args.after_audio_file || args.after_seek_file || args.out_file)
    .output(newFilename + '.mp4')

    if ( filetype !== '.webm' ) {
        command = command.output(newFilename + '.webm')
        .withVideoCodec('libvpx')
        .withAudioCodec('libvorbis')
        .withSize('672x384')
        .withAudioQuality(4)
        .toFormat('webm');
    }

    command.on('end', function() {
        args.outputFile = path.basename(newFilename, path.extname(newFilename));
        console.log('Finished processing' + args.outputFile);
        next(null, args);
    })
    .on('error', function (err) {
        console.log('outerr: ' + err);
        next(err);
    })
    .run();
};


module.exports.doMerge = function (args, next) {
    var initialFilename = args.pad_file;
    var newFilename = args.out_file;
    var mergedFilename = args.merge_file;

    new ffmpeg({source : initialFilename, logger : console})

    // new file path
    .input(newFilename)
    .mergeToFile(mergedFilename, process.cwd() + '/uploads')
    .on('error', function (err) {
        console.log('Merge failed: ' + err);
        next(err);
    })
    .on('end', function() {
        console.log('Merge finito!')
        next(null, args);
    });
}

// adds audio to the given video
module.exports.addAudio = function (args, next) {
    var sourcefilename = args.merge_file;

    var outputfile = args.after_audio_file;
    var audio = args.audioFile;

    new ffmpeg()
    .addInput(audio)
    .addInput(sourcefilename)
    .audioChannels(4)
    .complexFilter('[0:a][1:a]amerge, pan=stereo:c0<c0+c2:c1<c1+c3[out]')
    .outputOptions(['-map 1:v', '-map [out]', '-c:v copy', '-c:a libfdk_aac'])
    .save(outputfile)
    .on('error', next)
    .on('end', function () {
        console.log('Done audio')
        next(null, args);
    });
};


// TODO: SERIOUSE REFACTOR THIS
module.exports.storeImageFile = function(req, args) {
    var deferred = Q.defer();
    var file = req.files.file;
    var args = {
        file : file,
        filename : file.name,
        path : args.filePath || './public/img/'
    };

    // get size in MB
    var size = file.size;
    size /= (1000*1000);

    // max size = 4Mb
    if ( size > 4 ) {
        deferred.reject({err :'File too large'});
    } else if ( !((/^image/).test(file.type)) ) {
        deferred.reject({err :'File is not an image file'});
    } else {
        this.storeFile(args, function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
    }
    return deferred.promise;
},

module.exports.storeAudioFile = function (req, next) {
    var deferred = Q.defer();
    var file = req.files.file;
    var args = {
        file : file,
        filename : file.name,
        path : req.filePath || './public/audio/'
    };

    // max size = 10Mb
    var size = file.size;
    size /= (1000*1000);

    if ( size > 10 ) {
        deferred.reject({err :'File too large'});
    } else if ( !((/^audio/).test(file.type)) ) {
        deferred.reject({err :'File is not an audio file'});
    } else {
        this.storeFile(args, function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
    }
    return deferred.promise;
};

module.exports.storeVideoFile = function (req, opts, next) {
    var def = Q.defer();
    opts = opts || {};
    var file = req.files.file;
    var args = {
        file : file,
        filename : file.name,
        path : opts.path || vidDir
    };
    var size = file.size;
    size /= (1000*1000);

    // Do some error handling
    if ( size > 100) {
        // max size = 10Mb
        def.reject({err :'File too large'});

    } else if ( !((/^video/).test(file.type)) ) {
        // must be video file
        def.reject({err :'File is not a video'});

    } else {

        // Store the file to harddrive
        this.storeFile(args, function(err,res) {
            if (err) { def.reject(err); }
            else {

                // Create a thumbnail for the video
                if ( opts.thumb) {
                    createThumbnail(res)
                    .then(def.resolve, def.reject)
                    .done();
                }else {
                  def.resolve(res);
                }
            }
        });
    }
    return def.promise;
};

module.exports.createThumbnail = function (args, next) {
  var thumbDir = process.cwd() + '/public/video/thumbs/';

    ffmpeg(args.out_file)
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      next(err.message);
    })
    .on('end', function(filenames) {
      args.thumb = thumbDir + args.filename + '.png';
      console.log('Thumb File: ' + args.thumb);
      next(null, args);
    })
    .takeScreenshots({count : 1, timemarks: ['1.5' ], filename : args.filename}, thumbDir);
};
