/* global define */
define([
'backbone',
'views/modals/baseModalLayout',
'components/uploadComponent',
'hbs!tmpl/modals/uploadBattleSmplVideoView'
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
            // this.listenTo(this.model, 'battle:save:success', this.modelSaveSuccess);
            this.listenTo(this.model, 'sync', this.modelSaveSuccess);
            this.heading = opts.heading || 'Your turn to play. Upload the next battle video!';
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="play"]'   : '__playClicked',
            'click [data-evt="stop"]'   : '__stopClicked',
            // 'click [data-evt="submit"]' : '__submitClicked'
        }),

        /**
        * @otherTpl might be subclass's template
        */
        onShow : function (otherTpl) {
            // render this view's template
            BaseModalLayout.prototype.onShow.apply(this, arguments);

            // Render the body template
            otherTpl = otherTpl || tpl;
            this.ui.body.html(otherTpl(this.serializeData()));
            this.renderAsyncs();
        },

        // These things need the DOM to be ready in order to render
        renderAsyncs : function () {

            setTimeout( function () {
                try {
                    this.renderUpload();
                    this.renderOtherThings();
                } catch(e) {
                    console.log('sap: ' + e)
                    setTimeout(this.renderAsyncs.bind(this), 20);
                }
            }.bind(this), 20);
        },

        renderOtherThings : function () {},

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
                model : this.model,
                classes : 'upl-full',
                fileDrop : true,
                addFn : this.addFn.bind(this),
                region : this.$('[data-reg="upload"]')
            }).show();
            this.listenTo(this.uploadComponent, 'file:changed:thumb:created', this.videoUploaded);
        },

        videoUploaded : function (src) {
          this.showSelectedVideo(src);
        },

        showSelectedVideo : function (src) {
            this.$('[data-reg="upload"]').hide();

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

      startPlayer : function () {
        this.$('video')[0].play();
      },

       __playClicked : function () {
          this.startPlayer();
      },

      __stopClicked : function () {
        this.$('video')[0].pause();
        this.$('video')[0].duration = 0;
      },

      addFn : function (e, data) {
          data.context = $('<button class="btn btn-niz" data-evt="submit"/>').text('Done!')
          .appendTo(this.$('[data-reg="submit"]'))
          .click(function () {
              console.log('heihei')
                data.formData = this.model.getSaveData();
                if ( this.getSaveData ) _.extend(data.formData, this.getSaveData());
                data.context = $('<p/>').text('Uploading, be patient..').replaceAll(this.$('[data-evt="submit"]'));
                data.submit();
          }.bind(this));
      }

      // upload file, then post battleround
    //   __submitClicked : function () {
    //       // some biz logic here. Should be moved to battle/br object...
    //       var startSec = this.model.getStartSec();
      //
    //       this.model.postBattleRound({
    //           uploadComponent : this.uploadComponent,
    //           startSec : startSec,
    //           startFrame : 0,
    //           duration : this.$('video')[0].duration
    //       });
    //   }

    });

    return UploadBattleVideoView;
});
