var fs  = require('fs'),
  path  = require('path'),
  q     = require('q'),
  _     = require('underscore'),
  async = require('async'),
  ffmpeg = require('fluent-ffmpeg');

  function mergeFiles (args) {
      var source = 'public/video/battle/53d74c5965e2b5bf28ed8541_1407568174690.mp4';
      var inputf = 'public/video/battle/53d74c5965e2b5bf28ed8541_1407568174690_curr.mp4';
      var mergef = 'public/video/battle/53d74c5965e2b5bf28ed8541_1407568174690_seekednow.mp4';
      var tmpMerge = 'public/video/battle/53d74c5965e2b5bf28ed8541_1407568174690_tmp_merge.mp4'

      console.log('hei: ' + source );
      console.log('input: ' + inputf );
      console.log('m: : ' + mergef );

      new ffmpeg(source)
      .duration(8)
      .on('error', function(e, sap, error) {
          console.log('Merge error: ' + e +' , ' + error);
      })
      .on('end', function() {

          new ffmpeg(tmpMerge)
          .input(inputf)
          .on('error', function(e, sap, error) {
              console.log('Merge error: ' + e +' , ' + error);
          })
          .on('end', function() {
              fs.unlink(tmpMerge, function(err, res) {
                  console.log('Merge finito!');
              });
          })
          .mergeToFile(mergef);
      })
      .save(tmpMerge);
  }
  mergeFiles();
