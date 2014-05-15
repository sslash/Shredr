/* global define */
define([
    'backbone',
    'hbs!tmpl/globals/kickerRegion'
],
function (
    Backbone,
    Tpl
){
'use strict';
var KickerRegionView = Backbone.Marionette.Layout.extend({
    template : Tpl,
    className : 'kicker',
    ui : {
        kicker : '[data-mod="kicker"]',
        mid : '[data-mod="mid"]',
        right : '[data-mod="right"]'
    }
});

return KickerRegionView;
});
