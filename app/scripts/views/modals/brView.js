/* global require */
define([
  'backbone',
  'models/battleRequest',
  'models/jamtrack',
  'collections/jamtrackCollection',
  'components/uploadComponent',
  'libs/utils',
  'views/modals/baseModalLayout',
  'views/globals/playAudioView',
  'views/modals/uploadBattleAdvVideoView',
  'views/modals/uploadBattleSmplVideoView',
  'hbs!tmpl/modals/brView',
  'hbs!tmpl/battle/jamtrackForm'
  ],
  function (
    Backbone,
    BattleRequest,
    Jamtrack,
    JamtrackCollection,
    UploadComponent,
    utils,
    BaseModalLayout,
    PlayAudioView,
    UploadBattleAdvVideoView,
    UploadBattleSmplVideoView,
    tpl,
    jamtrackTpl
  ){
    'use strict';
    var BattleRequestView = BaseModalLayout.extend({

      initialize : function (opts) {
        BaseModalLayout.prototype.initialize.apply(this, arguments);
        this.jamtrackModel = new Jamtrack();
        this.brModel = new BattleRequest({
          battlee : this.model.get('_id'),
          mode : 'Simple'
        });
      },

      events : _.extend({}, BaseModalLayout.prototype.events, {
        'change input[type="range"]'    : '__rangeChanged',
        'click [data-evt="smpl"]'       : '__simpleClicked',
        'click [data-evt="save"]'       : '__saveClicked',
        'click [data-evt="adv"]'        : '__advClicked',
        'click [data-evt="play"]'       : '__playJamtrackClicked',
        'change [data-mod="jamtracks"]' : '__jamtrackSelected'
      }),

      ui : _.extend({}, BaseModalLayout.prototype.ui, {
        brRounds : '[data-mod="brRounds"]',
        brDays : '[data-mod="brDays"]'
      }),

      onClose : function () {
        //   this.uploadComponent.close();
      },

      onRender : function () {
        BaseModalLayout.prototype.onRender.apply(this, arguments);
        this.ui.body.html(tpl({
          battler : Shredr.user.toJSON(),
          battlee : this.model.toJSON()
        }));

        this.bindUIElements();
      },

      __rangeChanged : function(e) {
          var $ct = $(e.currentTarget);
          this.ui[$ct.attr('id')].text($ct.val());
      },

      __jamtrackSelected : function (e) {
        this.selectedJamtrack = this.jamtrackColl.get(e.currentTarget.value);
        this.brModel.set('jamtrackId', this.selectedJamtrack.toJSON());
      },

      __simpleClicked : function (e) {
        this.$('[data-evt="smpl"]').removeClass('opac');
        this.brModel.set('mode', 'Simple');
      },

      __advClicked : function () {
        this.$('[data-evt="adv"]').removeClass('opac');
        this.brModel.set('mode', 'Advanced');
        this.renderJamtrackForm();
      },

      __playJamtrackClicked : function (e) {
          this.playAudioView.playJamtrack(this.selectedJamtrack);
      },

      renderJamtrackForm : function () {
        // hide mode select images and buttons
        this.$('[data-mod="mode-head"]').text('Advanced Mode Selected');
        utils.execFadeOutIn(this.$('[data-reg="mode"]'), jamtrackTpl, function () {
            this.renderJamtracksColl();
            this.renderJamtrackPlayback();
            this.renderUploadComponent();
        }.bind(this));
      },

      renderJamtracksColl : function () {
        this.jamtrackColl = new JamtrackCollection();
        this.listenTo(this.jamtrackColl, 'reset', this.renderJamtracks);
        this.jamtrackColl.fetch({reset:true});
      },

      renderJamtrackPlayback : function () {
        this.playAudioView = new PlayAudioView();
        this.$el.append(this.playAudioView.render().el);
      },

      renderUploadComponent : function () {
        // this.uploadComponent = new UploadComponent({
        //   fileUpload : true,
        //   fileDrop : true,
        //   model : this.jamtrackModel,
        //   region : this.$('[data-reg="upload"]')
        // }).show();
      },

      renderJamtracks : function () {
        var $el = this.$('[data-mod="jamtracks"]');
        this.jamtrackColl.forEach(function(jt) {
          var html = '<option value="' + jt.get('_id') + '">' + jt.get('title') + '</option>';
          $el.append(html);
        });
      },

      doSave : {

          Simple : function () {
            //   this.saveModel();
            this.onSaveSuccess();
          },
          Advanced : function () {
              // if user has selected a jamtrack from the list.
              // no need to upload anything
              if ( this.brModel.get('jamtrackId') ) {
                  // this.saveModel();
                  this.onSaveSuccess();
                  // Or, user should have uploaded either a jamtrack (mode 1), or video
              } else {
                // not supported yet
                //   if ( !this.uploadComponent.fileAdded() ) {
                //       return alert('You must upload a jamtrack, or select an existing');
                //   }
                  //this.saveModel(this.uploadJamtrack.bind(this));
              }
          }
      },

      uploadJamtrack : function () {
        this.listenTo(this.uploadComponent, 'file:upload:success', this.onSaveSuccess.bind(this));
        this.uploadComponent.upload(this.brModel.getUploadUrl());
      },

      __saveClicked : function () {
        this.doSave[this.brModel.get('mode')].apply(this);
      },

      /**
      * Preconditions:
      * Mode1: will simply save br
      * Mode2: jamtrack has been uploaded, or jamtrackid is selected
      */
    //   saveModel : function (next) {
    //     // return this.onSaveSuccess(); //TODO just rm this
    //     Shredr.baseController.exec(this.brModel, 'save', {
    //       attrs : {
    //           rounds : this.$('#brRounds').val(),
    //           dayLimit : this.$('#brDays').val(),
    //           statement : this.$('#br-statement').val()
    //       },
    //       success : function (res) {
    //         if (next) { next(); }
    //         else { this.onSaveSuccess(res); }
    //       }.bind(this)
    //     });
    //   },

      onSaveSuccess : function (res) {
        // if (res) { this.brModel.set(res); }
        this.brModel.set({
            rounds : this.$('#brRounds').val(),
            dayLimit : this.$('#brDays').val(),
            statement : this.$('#br-statement').val()
        });

        var opts = {
            model : this.brModel,
            classes : 'modal-wide ',
            heading : 'Upload your initial battle video!'
        };
        var view = this.brModel.get('mode') === 'Advanced' ?
          new UploadBattleAdvVideoView(opts):
          new UploadBattleSmplVideoView(opts);

        Shredr.baseController.hideShowNewModal(view);
      }
    });

    return BattleRequestView;
  });
