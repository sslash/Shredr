/* global define */
define([
    'backbone',
    'hbs!tmpl/shred/shredDetailKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var ShredDetailKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl
});

return ShredDetailKickerView;
});
