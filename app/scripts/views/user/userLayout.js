/* global define */
define([
    'backbone',
    'views/modals/pmModal',
    'views/modals/brView',
    'components/fanComponent',
    'hbs!tmpl/user/userLayout'
],
function (
    Backbone,
    PmModal,
    BrView,
    FanComponent,
    tpl
){
'use strict';
var UserLayout = Backbone.Marionette.Layout.extend({
    template : tpl,

    events : {
        'click [data-evt="pm"]' : '__pmClicked',
        'click [data-evt="br"]' : '__brClicked'
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
