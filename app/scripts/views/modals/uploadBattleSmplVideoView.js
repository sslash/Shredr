//TODO: FINISH SAVE
/* global define */
define([
'backbone',
'views/modals/baseModalLayout',
'components/uploadComponent',
'hbs!tmpl/modals/uploadBattleSmplVideoView',
'autocomplete'
],
function (
    Backbone,
    BaseModalLayout,
    UploadComponent,
    tpl
){
    'use strict';
    var UploadBattleVideoView = BaseModalLayout.extend({

        initialize : function (opts) {
            opts.classes += ' form-dark';
            BaseModalLayout.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model, 'battle:save:success', this.modelSaveSuccess);
            this.heading = opts.heading || 'Your turn to play. Upload the next battle video!';
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="play"]'   : '__playClicked',
            'click [data-evt="stop"]'   : '__stopClicked',
            'click [data-evt="submit"]' : '__submitClicked'
        }),

        onShow : function () {
            // render this view's template
            BaseModalLayout.prototype.onShow.apply(this, arguments);

            // Render the body template
            this.ui.body.html(tpl(this.serializeData()));
            this.renderAsyncs();
        },

        // These things need the DOM to be ready in order to render
        renderAsyncs : function () {

            setTimeout( function () {
                try {
                    this.renderUpload();
                } catch(e) {
                    this.renderAsyncs.call(this);
                }
            }.bind(this), 20);
        },

        serializeData : function () {
            return {
              heading : this.heading,
              m : this.model.toJSON(),
              roundNo : this.model.getCurrentRound()
            };
        },

        renderUpload : function () {
            this.uploadComponent = new UploadComponent({
                fileUpload : true,
                classes : 'upl-small',
                fileDrop : true,
                region : new Backbone.Marionette.Region({ el : this.$('[data-reg="upload"]')})
            }).show();
            this.listenTo(this.uploadComponent, 'file:changed:thumb:created', this.videoUploaded);
        },

        videoUploaded : function (src) {
          this.showSelectedVideo(src);
        },

        showSelectedVideo : function (src) {
          this.$('[data-reg="upload"]').remove();

          // show the video-draggable region
          this.$dragRegion = this.$('[data-reg="video-drag"]');
          this.$dragRegion.append([
              '<video class="vid-drag" data-model="drag">',
              '<source src="' + src + '"></source></video>',
          ].join(''));
        },

      modelSaveSuccess : function () {
          this.__closeClicked();
      },

       __playClicked : function () {
          this.startPlayer();
      },

      __stopClicked : function () {
          this.vpComponent.trigger('player:stop');
      },

      // upload file, then post battleround
      __submitClicked : function () {
          this.model.postBattleRound({
              uploadComponent : this.uploadComponent
          });
      }

    });

    return UploadBattleVideoView;
});
