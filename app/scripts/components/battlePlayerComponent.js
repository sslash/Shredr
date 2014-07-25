// takes a list of videofile objects and an audio file
// listens to play and stop events
// on play, it will play the audio file, and the video files
// in the order they were given.

// used by battleChallengeResponse.js
define([
    'components/component'
    ],
    function( Component, tmpl ) {
        'use strict';

        var PlayIterator = function (videos, audio, uploadMode, component) {
            this.videos = videos;
            this.uploadMode = uploadMode;
            this.audio = audio;
            this.component = component;
        };

        PlayIterator.prototype = {

            stopVideo : function (currVid, peekVid) {
                if ( !currVid.stub ) {
                    currVid.pause();
                    currVid.currentTime = 0;

                    // only hide video if not in upload mode
                    if ( !this.uploadMode ) {
                        $(currVid).hide();
                    }
                }

                $(peekVid).show();
            },

            playAudio : function () {
                window.RAF(function() {
                    this.audio.play();
                }.bind(this));
            },

            doRAF : function (fn) {
                var that = this;
                function loop () {
                    fn();
                    that.animateId = window.RAF(loop);
                }
                loop();
            },

            start : function () {
                var dat = this;
                this.next();
                this.prev = { sel: {pause : function () {}, stub : true} }
                this.secs = 0;

                var startTime, duration, frames = 0;
                this.playAudio();
                startTime = new Date().getTime();
                playNext();

                function run () {
                    // set when next video starts
                    duration = getDurationForCurrentVideo();
                    loop();
                }

                function loop () {
                    var time = (new Date().getTime() - startTime) / duration;
                    frames ++;

                    // not done yet
                    if ( time < 1 ) {
                        requestAnimationFrame(loop);

                        // update time
                        if ( (frames % 60) === 0 ) {
                            dat.secs++;
                            frames = 0;
                            // update seconds in UI
                            dat.component.trigger('player:seconds', dat.secs);
                        }


                        // done with dat movie. try play next
                    } else {
                        playNext();
                    }
                }

                function playNext () {
                    dat.stopVideo(dat.prev.sel, dat.peekTwoVids());
                    dat.curr.sel.play();

                    if ( dat.hasNext() ) {
                        dat.next();
                        run();
                    }
                }

                function getDurationForCurrentVideo () {
                    return dat.curr.vidStartSec ?
                    // return length of next video, in MS
                    (dat.curr.vidStartSec + (dat.curr.vidStartFramesOffset/60)) * 1000
                    :
                    // or, if there is no next (i.e prev is the last video)
                    dat.prev.sel.duration
                }
            },

            peekTwoVids : function () {
                if ( this.hasNext() ) {
                    return this.videos[0].sel;
                }
            },

            next : function () {
                this.prev = this.curr;
                this.curr = this.videos.shift();
                console.log('next : ' + this.curr.vidStartSec + ', ' + this.curr.vidStartFramesOffset);
            },

            hasNext : function () {
                return !!this.videos.length;
            },

            stop : function () {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.stopVideo(this.prev.sel);
                this.stopVideo(this.curr.sel);
                window.cancelAnimationFrame(this.animateId);
            }
        }

        return Component.extend({

            initialize: function(options) {
                options || (options = {});
                this.videos = options.videos;
                this.mode = options.mode;
                this.uploadMode = options.uploadMode;
                //if ( this.videos[0].vidStartSec === 0 ) { this.videos[0].vidStartSec = 2; }
                this.audio = options.audio;
                this.listenTo(this, 'player:stop', this.stop);
            },

            play : function () {
                var startFn = function() {
                    this.playIterator = new PlayIterator(this.videos, this.audio, this.uploadMode, this);
                    this.playIterator.start();
                }, waitCondition;

                if ( this.mode === 'Simple' ) {

                    // if at least one video isn't ready
                    waitCondition = _.some(this.videos, function(v) {  v.readyState < 3 } );

                    // if at least one video isn't ready, or audio isn't ready, loop.
                } else {
                    waitCondition = _.some(this.videos, function(v) {  v.readyState < 3 } )
                    || this.audio.readyState < 3;
                }

                this.startPlayer(waitCondition, startFn);
            },

            startPlayer : function (waitCondition, playFn) {

                function tryRender () {
                    if (waitCondition) {
                        setTimeout(tryRender.bind(this), 40);

                    } else {
                        playFn.call(this);
                    }
                }
                tryRender.call(this);
            },

            stop : function () {
                this.playIterator.stop();
            }
        });
    });
