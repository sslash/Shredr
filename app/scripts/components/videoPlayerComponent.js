define([
    'backbone',
    'components/component',
    'libs/youtubePlayer',
    'hbs!tmpl/components/videoPlayerView',
    'hbs!tmpl/components/youtubePlayerView',

    ],
    function( Backbone, Component, YoutubePlayer, tpl, youtubeTpl ) {
        'use strict';

        var NormalView = Backbone.Marionette.ItemView.extend({
            template : tpl,
            initialize : function () {
                this.listenTo(this, 'player:playing', this.fadeOutMeta);
                this.listenTo(this, 'player:stopped', this.fadeInMeta);
            },

            fadeInMeta : function () {
                // this.$('#meta').fadeIn();
            },
            fadeOutMeta : function () {
                // this.$('#meta').fadeOut();
            },

            events : {
                'click [data-evt="play"]' : '__playClicked',
                'click [data-evt="stop"]' : '__stopClicked',
                // 'mouseover #meta' : 'fadeInMeta',
                // 'mouseout #meta' : 'fadeOutMeta'
            },

            getVideo : function () {
                this.video = this.video || this.$('video');
                return this.video;
            },

            __playClicked : function () {
                this.getVideo();
                this.video[0].play();
                this.trigger('player:playing');
            },

            __stopClicked : function () {
                this.getVideo();
                this.video[0].pause();
                this.video[0].currentTime = 0;
                this.trigger('player:stopped');
            }

        });

        var YoutubeView = NormalView.extend({

            onShow : function () {
                this.$('#play-wrap').html(youtubeTpl(this.model.toJSON()));
                this.initPlayer();
            },

            initPlayer : function () {
                this.player = new YoutubePlayer('player', this.model);
                this.listenTo(this.player, 'player:ready', this.playerReady);
                this.listenTo(this.player, 'player:playing', this.playerPlaying);
                this.player.onYouTubeIframeAPIReady();
            },

            __playClicked : function () {
                this.play();
            },

            __stopClicked : function () {
                this.player.stopVideo();
                this.trigger('player:stopped');
            },

            playerPlaying : function () {
                this.trigger('player:playing');
            },

            playerReady : function () {
                this.trigger('player:ready');
            },

            getDuration : function () {
                return this.playerIsReady ? this.player.getDuration() : null;
            },

            play : function () {
                this.player.play();
            }

        });

        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);

                if ( this.model.get('youtubeId') && this.model.get('youtubeId').length > 0 ) {
                    this.view = new YoutubeView({model : this.model});
                } else {
                    this.view = new NormalView({model : this.model});
                }

                this.listenTo(this.view, 'player:playing', this.playerStartedPlaying);
            },

            playerStartedPlaying : function () {
                this.model.tryIncreaseView();
            }
        });
    });
