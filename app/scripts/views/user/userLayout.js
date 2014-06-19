/* global define */
define([
    'backbone',
    'views/modals/pmModal',
    'components/fanComponent',
    'hbs!tmpl/user/userLayout'
],
function (
    Backbone,
    PmModal,
    FanComponent,
    tpl
){
'use strict';
var UserLayout = Backbone.Marionette.Layout.extend({
    template : tpl,

    events : {
        'click [data-evt="pm"]' : '__pmClicked'
    },

    onRender : function () {
        this.renderFanButton();
    },

    renderFanButton : function () {
        new FanComponent({
            model : this.model,
            region : new Backbone.Marionette.Region({el : this.$('[data-reg="fan"]')})
        }).show();
    },

    __fanClicked : function (e) {

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
