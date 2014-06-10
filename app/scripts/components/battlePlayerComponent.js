// http://flippinawesome.org/2014/05/20/frame-by-frame-animation-with-html-and-javascript/?utm_source=html5weekly&utm_medium=email
// TODO: use the timing algorithm described above ^^ -->
/*
var redbox = document.getElementById("redbox-06");
var startBtn = document.getElementById("redbox-btn-06");
var input = document.getElementById("redbox-input-02");

var startTime, duration;
var rect = redbox.getBoundingClientRect();
var startX = 0, endX = 520 - rect.width * 2;

var setX = function(element, x) {
    var t = "translateX(" + x + "px)";
    var s = element.style;
    s["transform"] = t;
    s["webkitTransform"] = t;
    s["mozTransform"] = t;
    s["msTransform"] = t;
}

var run = function() {
    var time = (new Date().getTime() - startTime) / duration;
    if(time < 1) {
        requestAnimationFrame(run);
        setX(redbox, startX + (endX - startX) * time);
    } else {
        setX(redbox, endX);
    }
}

var start = function() {
    duration = input.value;
    startTime = new Date().getTime();
    run();
}
*/


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

        stopVideo : function (currVid, peekVid) {
            if ( !currVid.stub ) {
                currVid.pause();
                currVid.currentTime = 0;
                $(currVid).hide();
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
            this.next();
            this.prev = { sel: {pause : function () {}, stub : true} }

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
                if ( (this.secs === this.curr.vidStartSec) &&
                    (this.frames === this.curr.vidStartFramesOffset) ) {
                        console.log('yeah..')
                        this.stopVideo(this.prev.sel, this.peekTwoVids());
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
                this.stopVideo(this.prev);
                this.audio.pause();
                this.audio.currentTime = 0;
                window.cancelAnimationFrame(this.animateId);
            }
        }

        return Component.extend({

            initialize: function(options){
                options = options || {};
                this.videos = options.videos;
                if ( this.videos[0].vidStartSec === 0 ) { this.videos[0].vidStartSec = 2; }
                this.audio = options.audio;
                this.listenTo(this, 'player:stop', this.stop);
            },

            startPlayer : function (playFn) {

                function tryRender () {
                    // if some videos aren't ready, or audio isn't ready, loop.
                    if ( _.some(this.videos, function(v) {  v.readyState < 3 } )
                    || this.audio.readyState < 3 ) {
                        setTimeout(tryRender.bind(this), 40);

                    } else {
                        playFn.call(this);
                    }
                }
                tryRender.call(this);
            },



            play : function () {
                this.startPlayer(function() {
                    this.playIterator = new PlayIterator(this.videos, this.audio, this);
                    this.playIterator.start();
                });
            },

            stop : function () {
                this.playIterator.stop();
            }
        });
    });
