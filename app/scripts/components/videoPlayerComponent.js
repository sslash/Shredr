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

        var PlayIterator = function (videos, audio, component) {
            this.videos = videos;
            this.audio = audio;
            this.component = component;
        };

        PlayIterator.prototype = {

            playAudio : function () {
                window.RAF(function() {
                    this.audio.play();
                }.bind(this));
            },

            stopVideo : function (vid) {
                vid.sel.pause();
                vid.sel.currentTime = 0;
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
                this.next();
                this.prev = { sel: {pause : function () {}} }

                this.secs = 0;
                this.frames = 0;

                this.playAudio();

                this.doRAF(function() {

                    if ( (this.frames % 60) === 0 ) {
                        this.secs ++;
                        this.frames = 0;
                        // update seconds in UI
                        this.component.trigger('player:seconds', this.secs);
                    }
                    // console.log('s: ' + this.secs + ', f: ' + this.frames)
                    if ( this.secs   === this.curr.vidStartSec &&
                         this.frames === this.curr.vidStartFramesOffset ) {
                             this.stopVideo(this.prev);
                             this.curr.sel.play();

                        if ( this.hasNext() ) {
                            this.next();
                        } else {
                            console.log('no more vids..');
                        }
                    }

                    this.frames ++;

                }.bind(this));
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
                this.stopVideo(this.prev);
                this.audio.pause();
                window.cancelAnimationFrame(this.animateId);
            }
        }

        return Component.extend({

            initialize: function(options){
                options = options || {};
                this.videos = options.videos;
                this.audio = options.audio;
                this.listenTo(this, 'player:play', this.play);
                this.listenTo(this, 'player:stop', this.stop);
            },

            play : function () {
                this.playIterator = new PlayIterator(this.videos, this.audio, this);
                this.playIterator.start();
            },

            stop : function () {
                this.playIterator.stop();
            }
        });
    });
