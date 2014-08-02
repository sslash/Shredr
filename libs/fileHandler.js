  var fs    = require('fs'),
    path  = require('path'),
    Q     = require('q'),
    async = require('async'),
    ffmpeg = require('fluent-ffmpeg'),
    vidDir = './public/video/',

    // stored in mongo
    thumbDir = '/video/thumbs/';

    // Stored on hdd
var thumbDirStore =  './public' + thumbDir;


module.exports.storeFile = function (args, next) {

    // get the temporary location of the file
    var tmp_path = "./" + args.file.path;

    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = args.path + args.filename;
    console.log("Will save file to: " + target_path);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) {
            console.log("Error saving file! " + JSON.stringify(err));
            next.call(null, {err : err}, {});
        }
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                //throw err;
                console.log('error saving file! ' + err);
                next.call(null, {err : err}, {});
            } else {
                console.log('File Saved.');
                //res.send('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
                next.call(null, null, {file : args.file});
            }
        });
    });
};

module.exports.saveInitialBattleAdv = function (req, args) {
    var def = Q.defer();

    async.waterfall([
        this.setNewDuration.bind(null, req, args),
        this.addAudio
    ], function (err, res) {
        if (err) def.reject(err);
        else def.resolve(res);
    });

    return def.promise;
};

// adds audio to the given video
module.exports.addAudio = function (req, args, next) {
    var sourcefilename = args.filepath + args.file2;
    var outputfile = args.filepath + args.outputfile;
    var test = process.cwd() + '/public/video/battle/test.mp4';
    var audio = args.audio;
    new ffmpeg({logger : console})
    .addInput(audio)
    .addInput(sourcefilename)
    .audioChannels(4)
    .complexFilter('[0:a][1:a]amerge, pan=stereo:c0<c0+c2:c1<c1+c3[out]')
    .outputOptions(['-map 1:v', '-map [out]', '-c:v copy', '-c:a libfdk_aac'])
    .save(test)
    .on('error', next)
    .on('end', function () {
        console.log('DONE')
        next(null, req, args);
    })
    // .run();

};

// sets start and end time to given movie.
module.exports.setNewDuration = function (req, args, next) {
    var sourcefilename = args.filepath + args.file1;
    var outputfile = args.filepath + args.file2;

    try {
        var command = new ffmpeg({source : sourcefilename});

        if ( args.start) {
            command = command.seek(args.start);
        }

        if (args.duration) {
            command = command.duration(args.duration);
        }

        command
        .output(outputfile)
        .on('error', function(err) {
            console.log('error: ' + err);
        })
        .on('end', function (res) {
            console.log('yeah this is done');
            next(null, req, args);
        })
        .run();
    }catch(e) {
        console.log('errrrr: ' + e); next(e);
    }
};

module.exports.doMerge = function (req, args, next) {

    // var file = req.files.file;
    // var tmp_path = './' + file.path;
    // var newfilename = args.path + file.name;
    // var initialFilename = './public/video/battle/' + args.orgFile.videoFileId;

    var initialFilename = args.filepath + args.file1;
    var newFilename = args.filepath + args.file3;
    var mergedFilename = process.cwd() + '/public/video/battle/mergedFile.mp4';

    // old file path
    try {
        new ffmpeg({source : initialFilename, logger : console})

        // new file path
        .input(newFilename)
        .mergeToFile(mergedFilename, process.cwd() + '/uploads')
        .on('error', function (err) {
            console.log('Error merging: ' + err); next(err);
        })
        .on('end', function() {

            console.log('merge finito!')
            next(null, {
                file : {
                    name : mergedFilename
                }
            });
            // store the merged file
            // this.storeFile({
            //     file :
            //     filename :
            //     path : args.path
            // })
        });
        }catch(e) {
            console.log('failed: ' + e);
            next(e);
        }

}

module.exports.createMergedBattleFile = function (req, args) {
    var def = Q.defer();

    async.waterfall([
        this.setNewDuration.bind(null, req, args),
        this.doMerge
    ], function (err, res) {
        if(err) def.reject(err);
        else def.resolve(res);
    });


    return def.promise;
}

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

function createThumbnail(res) {
    var deferred = Q.defer();
    var filepath = vidDir + res.file.name;
    new ffmpeg({ source: filepath })
    .withSize('320x240')
    .on('error', function (err) {
        console.log('fail: ' + err.message);
        deferred.reject(err.message);
    })
    .on('end', function(filenames) {
        console.log('Successfully generated ' + filenames.join(', '));
        res.thumb = filenames.length ? thumbDir + filenames[0] : null;
        deferred.resolve(res);
    })
    .takeScreenshots(1, thumbDirStore);

    return deferred.promise;
}
