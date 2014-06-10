define([
    'backbone',
    'components/component',
    'hbs!tmpl/components/youtubeComponent',
    ],
    function( Backbone, Component, Tpl) {
        'use strict';

        var YouTubeView = Backbone.Marionette.ItemView.extend({
            template : Tpl
        });

        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);
                this.view = new YouTubeView();
                window.addEventListener('message', this.receiveIframeMessage.bind(this), false);
            },

            /*
            * Received message back from youtube (iframe js script)
            * Triggered (twice) when the iFrame is loaded,
            * and after the video is submitted to youtube
            *
            *  The latter message includes:
            * event : {"youtubeUrl":"http://youtu.be/v_ck-cNNKxU",
            *          "youtubeId":"v_ck-cNNKxU"};
            *
            * These attributes are saved on the model, and must be used to
            * show the video instead of the button after the upload is made.
            */
            receiveIframeMessage : function(event) {
                event.preventDefault();
                if ( event.data ) {
                    try {
                        var data = JSON.parse(event.data);
                        if ( data.youtubeUrl && data.youtubeId ) {
                            this.model.set({
                                youtubeUrl : data.youtubeUrl,
                                youtubeId : data.youtubeId
                            });
                            Shredr.baseController.exec(this.model, 'save', {
                                event : 'shred:save'
                            });
                        }
                    } catch(e) {
                        console.log('Failed to upload video: ' + e);
                    }
                }
            },

            // Sends message to save the video to youtube
            uploadFormSubmitted : function(e) {

                var data = JSON.stringify({
                    title : this.model.get('title'),
                    description : this.model.get('description')
                });

                var receiver = document.getElementById('receiver').contentWindow;
                receiver.postMessage(data, '*');
            }
        });
    });
