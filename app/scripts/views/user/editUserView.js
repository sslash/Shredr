/* global require */
define([
'backbone',
'components/uploadComponent',
'views/modals/baseModalLayout',
'hbs!tmpl/user/editUser'
],
function (
    Backbone,
    UploadComponent,
    BaseModalLayout,
    tpl
){
    'use strict';
    var EditUserView = BaseModalLayout.extend({

        initialize : function (opts) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="save"]' : '__saveClicked'
        }),

        onRender : function () {
            BaseModalLayout.prototype.onRender.apply(this, arguments);
            this.ui.body.html(tpl({m : this.model.toJSON()}));
            this.bindUIElements();
        },

        onShow : function () {
            BaseModalLayout.prototype.onShow.apply(this, arguments);
            this.renderUploadComponent();
        },

        renderUploadComponent : function () {
            this.uploadComponent = new UploadComponent({
                fileUpload : true,
                fileDrop : true,
                region : new Backbone.Marionette.Region({ el : this.$('[data-reg="upload"]')})
            }).show();
        },

        __saveClicked : function () {
            if ( this.uploadComponent.fileAdded() ) {
                this.uploadComponent.trigger('file:upload', this.model.getUploadUrl());
                this.listenTo(this.uploadComponent, 'file:upload:success', this.saveModel);
            }else {
                this.saveModel();
            }
        },

        saveModel : function () {
            this.model.set({
                startedPlaying : this.$('#guitar-start').val(),
                location : this.$('#city').val(),
                birth : this.$('#birth').val(),
                bio : this.$('#bio').val()
            });

            Shredr.baseController.exec(this.model, 'save', {
                success : this.__closeClicked.bind(this)
            });
        }
    });

    return EditUserView;
});
