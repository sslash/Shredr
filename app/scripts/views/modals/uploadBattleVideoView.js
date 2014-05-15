/* global require */
define([
'backbone',
'views/modals/baseModalLayout',
'components/uploadComponent',
'components/videoPlayerComponent',
'hbs!tmpl/modals/uploadBattleVideoView',
'autocomplete'
],
function (
    Backbone,
    BaseModalLayout,
    UploadComponent,
    VPComponent,
    Tpl
){
    'use strict';
    var UploadBattleVideoView = BaseModalLayout.extend({

        initialize : function (opts) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="play"]' :    '__playClicked',
            'click [data-evt="stop"]' :    '__stopClicked'
        }),

        onShow : function () {
            // render this view's template
            BaseModalLayout.prototype.onShow.apply(this, arguments);
            this.ui.body.html(Tpl(this.serializeData()));

            // set ui now that DOM has new stuff
            this.ui.duration = this.$('[data-model="dur"]');

            this.renderAsyncs();
        },

        serializeData : function () {
            return this.model.toJSON();
        },

        renderAsyncs : function () {

            // These things need the DOM to be ready in order to render
            setTimeout( function () {
                try {
                    this.renderUpload();
                    this.renderCanvas();
                } catch(e) {
                    console.log('sap error: ' + e)
                    this.renderAsyncs.call(this);
                }
            }.bind(this), 50);
        },

        renderUpload : function () {
            this.uploadComponent = new UploadComponent({
                fileUpload : true,
                fileDrop : true,
                region : new Backbone.Marionette.Region({ el : this.$('[data-reg="upload"]')})
            }).show();
            this.listenTo(this.uploadComponent, 'file:changed:thumb:created', this.videoUploaded);
        },

        // removes the upload compoment. Renders a draggable video frame
        videoUploaded : function (src) {
            // remove the upload region
            this.$('[data-model="instr"]').text('Drag the video on the timeline so it starts on the correct timeframe');
            this.$('[data-reg="upload"]').remove();

            // show the video-draggable region
            this.$dragRegion = this.$('[data-reg="video-drag"]');
            // this.$dragRegion.addClass('drag-vid-region');
            this.$('[data-reg="arrow"]').show();

            // save a reference to the region's rect
            this.videoDragRect = $.find('[data-reg="video-drag"]')[0].getBoundingClientRect();

            // add the uploaded video to that region
            this.$dragRegion.append([
                '<video class="vid-drag" data-model="drag">',
                '<source src="' + src + '"</source></video>',
            ].join(''));

            // save a reference to the video
            this.$video = this.$('[data-model="drag"]');
            this.$video.draggable({
                containment: 'parent',
                stop: this.dragStop.bind(this)
            });
        },

        // set number of seconds until video must start
        dragStop : function (e) {
            // get percentage of pixels from left
            var left = $(e.target)[0].getBoundingClientRect().left;
            left = left - this.videoDragRect.left;

            // percent from left
            var vidStartPercent = (left/this.videoDragRect.width) * 100;

            // set this percent in seconds (i.e play-offset into audio)
            this.setVidStartSec(vidStartPercent);

            // update the second offset in the UI
            if ( !this.$offset) {
                this.$offset = this.$('[data-model="offset"]');
            }
            this.$offset.animate({'left' : left + 'px'});
            this.$offset.text(this.vidStartSec + ':' + this.vidStartFramesOffset + 'f');
        },

        setVidStartSec : function (vidStartPercent) {
            var audioLength = this.$audio[0].duration;
            var vidStartSec = (audioLength / 100) * vidStartPercent
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
            this.$audio = $('audio');
            var $audioRegion = $.find('[data-reg="audio"]');
            var rect = $audioRegion[0].getBoundingClientRect();

            var tryRender = function () {
                if ( this.$audio[0].readyState < 3 ) {
                    setTimeout(tryRender.bind(this), 40);
                } else {

                    // assume last vid has vidstartsec = 13 + frames = 40
                    // first, get fract (x,fract)
                    var fract = (40/60);

                    // then calculate offset percentage (13,frames secs into audio.duration)
                    var percent = (100 / this.$audio[0].duration) * 13 + fract;
                    var pixelsLeft = (rect.width / 100)*percent;

                    // Draw the canvas pixelsLeft to the left on the audio buffer thing
                    var c = document.getElementById("myCanvas");
                    c.width = rect.width;
                    var ctx = c.getContext("2d");
                    ctx.beginPath();
                    ctx.moveTo(pixelsLeft, 0);
                    ctx.lineTo(pixelsLeft, rect.height-1);
                    ctx.stroke();

                    // render the offset label
                    this.$offsetLabel = this.$('[data-model="offsetLast"]');
                    this.$offsetLabel.animate({'left' : pixelsLeft + 'px'});
                    this.$offsetLabel.text('13:40f');
                }
            }

            tryRender.call(this);
        },

        renderPlayer : function () {
            var audio = this.$audio[0];
            var DOMvideos = this.$('[data-model="battle-vid"]').get();

            function tryRender () {

                // if some videos aren't ready, or audio isn't ready, loop.
              if ( _.some(DOMvideos, function(v) {  v.readyState < 3 }) || audio.readyState < 3) {
                      setTimeout(tryRender.bind(this), 40);
              } else {
                  // craete a playable list of all previous battle videos
                  var rounds = this.model.get('rounds');
                  var vpVideos = _.map(DOMvideos, function(v, i) {
                      return {
                          sel : v,

                          // get vid start sec and offset
                          vidStartSec : 6 + i*10,
                          vidStartFramesOffset: 13 + i*10 // this is just to fake TODO FIX ME
                      };
                  });

                    // add the current vid to this list.
                    // if it has been added yet.
                  var newVid = this.$('[data-model="drag"]');
                  if ( newVid ) {
                      vpVideos.push({
                          sel:newVid[0],
                          vidStartSec : this.vidStartSec,
                          vidStartFramesOffset : this.vidStartFramesOffset
                      })
                  }

                 // create a new videoplayercomnponent.
                  this.vpComponent = new VPComponent({
                      videos : vpVideos,
                      audio : audio
                  });
                  this.listenTo(this.vpComponent, 'player:seconds', this.renderPlaySeconds);
              }
          }
          tryRender.call(this);
      },

      renderPlaySeconds : function (seconds) {
          var mins = Math.floor(seconds / 60);
          var secs = seconds % 60;
          this.ui.duration.text(mins + ':' + secs);
      },

       __playClicked : function () {
           this.renderPlayer();
          this.vpComponent.trigger('player:play');
      },

      __stopClicked : function () {
          this.vpComponent.trigger('player:stop');
      }

    });

    return UploadBattleVideoView;
});
