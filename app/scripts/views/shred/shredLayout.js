/* global define */
define([
    'backbone',
    'hbs!tmpl/shred/shredLayout'
],
function (
    Backbone,
    Tpl
){
'use strict';
var ShredLayout = Backbone.Marionette.Layout.extend({
    template : Tpl
});

return ShredLayout;
});
