/* global require */
define([
    'backbone',
    'hbs!tmpl/globals/flashRegionView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var NavRegionView = Backbone.Marionette.ItemView.extend({
    template : Tpl,
    initialize : function (options) {},

    ui : {
        fullScreen : '.full-screen'
    },

    toggleOverlay : function (style) {
        this.ui.fullScreen.toggleClass('show');
        if ( style ) {
            this.ui.fullScreen.toggleClass(style);
        }
    }
});

return NavRegionView;
});
