/* global require */
define([
    'backbone',
    'libs/utils',
    'hbs!tmpl/modals/baseModalLayout'
],
function (
    Backbone,
    utils,
    Tpl
){
'use strict';
var BaseModal = Backbone.Marionette.Layout.extend({
    template : Tpl,
    className : 'modal pull-down',

    initialize : function (opts) {
        this.extraClasses = opts.classes || '';
    },
    events : {
        'click [data-evt="close"]' : '__closeClicked'
    },

    ui : { body : '[data-reg="body"]'},

    onShow : function () {
        setTimeout(function() {
            this.$el.addClass('pull-down-after');
        }.bind(this));
    },

    onRender : function () {
        this.$el.addClass(this.extraClasses);
    },

    __closeClicked : function () {
        utils.execTransition(this.$el[0],
            function () { this.$el.removeClass('pull-down-after'); },
            function () { Shredr.vent.trigger('modal:close'); },
            this
        );
    }
});

return BaseModal;
});
