var fs    = require('fs'),
    path  = require('path'),
    Q     = require('q'),
    FFmpeg = require('fluent-ffmpeg'),
    vidDir = './public/video/';


module.exports.storeFile = function (args, next) {

    // get the temporary location of the file
    var tmp_path = "./" + args.file.path;
    console.log("Tmp path is: " + tmp_path);

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
                next.call(null, {err : err}, {});
            } else {
                //res.send('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
                next.call(null, null, {file : args.file});
            }
        });
    });
};

module.exports.storeAudioFile = function (req, next) {
    var deferred = Q.defer();
        var file = req.files.file;
        var args = {
            file : file,
            filename : file.name,
            path : './public/audio/'
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
        path : opts.path || './public/video/'
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
                }
            }
        });
    }
    return def.promise;
};

function createThumbnail(res) {
    var deferred = Q.defer();
    var filepath = vidDir + res.file.name;
    new FFmpeg({ source: filepath })
    .withSize('320x240')
    .on('error', function (err) {
        console.log('fail: ' + err.message);
        deferred.reject(err.message);
    })
    .on('end', function(filenames) {
        console.log('Successfully generated ' + filenames.join(', '));
        res.thumb = filenames.length ? filenames[0] : null;
        deferred.resolve(res);
    })
    .takeScreenshots(1, './public/video/thumbs');
    return deferred.promise;
}
