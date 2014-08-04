/* global define */
define([
    'backbone',
    'views/modals/pmModal',
    'views/modals/brView',
    'views/user/editUserView',
    'components/fanComponent',
    'components/uploadComponent',
    'hbs!tmpl/user/userLayout'
],
function (
    Backbone,
    PmModal,
    BrView,
    EditUserView,
    FanComponent,
    uploadComponent,
    tpl
){
'use strict';
var UserLayout = Backbone.Marionette.Layout.extend({
    template : tpl,

    initialize : function () {
        this.listenTo(Shredr.vent, 'users:layout:renderEditView', this.renderEdit);
    },

    events : {
        'click [data-evt="pm"]' : '__pmClicked',
        'click [data-evt="br"]' : '__brClicked',
        'click [data-evt="battle-clk"]' : '__battleClicked'
    },

    onRender : function () {
        this.renderFanButton();
        var uploadForm = new uploadComponent({
            region : this.$('#uploader'),
            url : '/api/battleRequest/',
            model : this.model
        }).show();
    },

    serializeData : function () {
        return { m : JSON.stringify(this.model) };
    },

    renderFanButton : function () {
        new FanComponent({
            model : this.model,
            region : new Backbone.Marionette.Region({el : this.$('[data-reg="fan"]')})
        }).show();
    },

    renderEdit : function () {
        Shredr.baseController.showModal(new EditUserView({
            model : this.model,
            classes : 'modal-huge modal-tall form-dark'
        }));
    },

    __battleClicked : function (e) {
        var id = $(e.currentTarget).attr('data-mod');
        Shredr.navigate('/battle/' + id, {trigger : true});
    },

    __brClicked : function (e) {
        Shredr.baseController.showModal(new BrView({
            model : this.model,
            classes : 'modal-huge modal-tall form-dark'
        }));
    },

    __pmClicked : function () {
        var view = new PmModal({
            model : this.model,
            classes : 'modal-short form-dark'
        });
        Shredr.baseController.showModal(view);
    }
});

return UserLayout;
});
