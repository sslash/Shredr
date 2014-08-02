//TODO: FINISH SAVE
/* global define */
define([
'views/modals/uploadBattleSmplVideoView',
'components/battlePlayerComponent',
'hbs!tmpl/modals/uploadBattleAdvVideoView',
'autocomplete'
],
function (
    UploadBattleSmplVideoView,
    VPComponent,
    tpl
){
    'use strict';
    var UploadBattleVideoView = UploadBattleSmplVideoView.extend({

        onShow : function () {
            UploadBattleSmplVideoView.prototype.onShow.call(this, tpl);
            // set UI now that DOM has new stuff
            this.ui.duration = this.$('[data-model="dur"]');

            // save a reference to the video drag region's rect
            this.videoDragRect = this.$('[data-reg="video-drag"]')[0].getBoundingClientRect();
        },

        // These things need the DOM to be ready in order to render
        renderAsyncs : function () {

            setTimeout( function () {
                try {
                    this.renderUpload();
                    this.renderCanvas();
                    this.setVideoWidths();
                } catch(e) {
                    setTimeout(this.renderAsyncs.bind(this), 20);
                }
            }.bind(this), 20);
        },

        // removes the upload compoment. Renders a draggable video frame
        videoUploaded : function (src) {

            this.$('[data-reg="audio"]').show();

            // remove the upload region
            this.$('[data-model="instr"]').text('Drag the video on the timeline so it starts on the correct timeframe');

            this.$('[data-reg="arrow"]').show();

            this.showSelectedVideo(src);

            // save a reference to the video
            this.$video = this.$('[data-model="drag"]');
            this.$video.draggable({
                containment: 'parent',
                stop: this.dragStop.bind(this)
            });
        },

        // set number of seconds until video must start
        dragStop : function (e) {
            if(!this.readyState) {
                return alert('Error, failed to fetch audio. Please try again later');
            }

            // get percentage of pixels from left
            var $ct = $(e.target);
            var pixelsLeft = $ct.position().left;
            var vidStartPercent = (pixelsLeft/this.videoDragRect.width) * 100;

            // set this percent in seconds (i.e play-offset into audio)
            this.setVidStartSec(vidStartPercent);

            // update the second offset in the UI
            if ( !this.$offset) {
                this.$offset = this.$('[data-model="offset"]');
            }

            this.$offset.animate({'left' : pixelsLeft + 'px'});
            this.$offset.text(this.vidStartSec + ':' + this.vidStartFramesOffset + 'f');
        },

        setVidStartSec : function (vidStartPercent) {
            var audioLength = this.$audio.duration;
            var vidStartSec = (audioLength / 100) * vidStartPercent;
            this.vidStartFramesOffset = 0;

            // set offset in frames
            var frac = (vidStartSec+'').match(/\d+\.(\d\d)/);
            if (frac && frac.length > 0 ) {
                frac = parseInt(frac[1],10);
                // save frames (max 59)
                this.vidStartFramesOffset = Math.floor((frac / 100) * 60);
            }
            // only for debug
            this.vidStartFrac = vidStartSec;

            // save seconds
            this.vidStartSec = Math.floor(vidStartSec);
        },

        // vertical canvas line that is represents the finish point of the last
        // video. Sets the this.$audio property
        renderCanvas : function () {
            this.$audio = document.querySelector('[data-model="audio"]');
            var $audioRegion = this.$('[data-reg="audio"]');

            var tryRender = function () {
                if ( this.$audio.readyState < 3 ) {
                    setTimeout(tryRender.bind(this), 40);
                } else {
                    this.readyState = true;
                    var lastSec = this.getLastVideoSec();
                    var audioSecs = this.$audio.duration;

                    var lastVidEndPercent = (lastSec/audioSecs) * 100;
                    var audioRegionWidth = $audioRegion.width();
                    var lastVidLeftOffsetPx = (audioRegionWidth / 100) * lastVidEndPercent;

                    // render the offset label
                    this.$offsetLabel = this.$('[data-model="offsetLast"]');
                    this.$offsetLabel.animate({'left' : lastVidLeftOffsetPx + 'px'});
                    this.$offsetLabel.text(lastSec);


                    // set video-region widths
                    var $videos = this.$('[data-reg="vids"]');
                    $videos.css({width : lastVidLeftOffsetPx + 'px'});
                }
            };

            tryRender.call(this);
        },

        getLastVideoSec : function () {
            var startTime = this.getStartTimeForLastVideo();
            return startTime.sec + (startTime.frames/60);
        },

        setVideoWidths : function () {

            var $vids = this.$('[data-model="battle-vid"]');
            var len = $vids.length;
            $vids.each(function() {
                var width = (1 / len) * 100 - 1;
                $(this).css({width : width + '%'});
            });
        },

        getStartTimeForLastVideo : function () {
            var lastVideo = this.model.getLastVideo();
            var startSec = parseFloat(lastVideo.startSec,10) + parseFloat(lastVideo.duration,10);
            var startFrame = parseFloat(lastVideo.startFrame,10);
            return {
                sec : startSec,
                frames : startFrame
            };
        },

        // gets all DOM videos (except the one the user adds)
        getDOMVideos : function () {
            return this.$('[data-model="battle-vid"]').get();
        },

        // Play clicked! must set up the videoplayer component and start playing..
        startPlayer : function () {
            var audio = this.$audio;

            var DOMvideos = this.getDOMVideos();
            // craete a playable list of all previous battle videos
            var rounds = this.model.get('rounds');
            var vpVideos = _.map(DOMvideos, function(v, i) {
                var roundi  = Math.floor(i/2);
                var turni = i % 2;
                return {
                    sel : v,
                    // get vid start sec and offset
                    vidStartSec : parseInt(rounds[roundi][turni].startSec, 10), //+ 2,
                    vidStartFramesOffset: parseInt(rounds[roundi][turni].startFrame, 10)
                };
            });

            // add the current vid to this list.
            // if it has been added yet.
            var newVid = this.$('[data-model="drag"]');
            if ( newVid && newVid.length) {
                vpVideos.push({
                    sel:newVid[0],
                    duration : newVid[0].duration,
                    vidStartSec : this.vidStartSec,
                    vidStartFramesOffset : this.vidStartFramesOffset
                });
            }

            // create a new videoplayercomnponent.
            this.vpComponent = new VPComponent({
                videos : vpVideos,
                audio : audio,
                uploadMode : true
            });
            this.listenTo(this.vpComponent, 'player:seconds', this.renderPlaySeconds);
            this.vpComponent.play();
      },

      // Triggered every second
      renderPlaySeconds : function (seconds) {
          var mins = Math.floor(seconds / 60);
          var secs = seconds % 60;
          this.ui.duration.text(mins + ':' + secs);
      },

      __stopClicked : function () {
          this.vpComponent.trigger('player:stop');
      },

      // upload file, then post battleround
      __submitClicked : function () {

          this.model.postBattleRound({
              uploadComponent : this.uploadComponent,
              startSec : this.vidStartSec,
              duration : this.$video[0].duration,
              startFrame : this.vidStartFramesOffset
          });
      }

    });

    return UploadBattleVideoView;
});
