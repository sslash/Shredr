// TODO: build a base nav view that this one extends.
// the base nav is used for non-logged in users
/* global define Shredr */
define([
    'backbone',
    'hbs!tmpl/globals/navRegion'
],
function (
    Backbone,
    Tpl
){
'use strict';
var NavRegionView = Backbone.Marionette.Layout.extend({
    template : Tpl,
    className : 'nav',

    initialize : function () {
        this.listenTo(Shredr.vent, 'mainRegion:preRender', this.setActiveClass);
    },

    setActiveClass : function (category) {
        console.log('ca: ' + category);
        this.$('.active').removeClass('active');
        var sel = '[data-mod="' + category + '"]';
        this.$(sel).addClass('active');
    }
});

return NavRegionView;
});
