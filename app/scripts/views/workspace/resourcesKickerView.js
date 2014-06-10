/* global define */
define([
    'backbone',
    'hbs!tmpl/workspace/resourcesKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var ResourcesKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,

    events : {
        'click [data-evt="scales"]' : '__scalesClicked',
        'click [data-mod="add-btn"]': '__addClicked'
    },

    ui : {
        button : '[data-mod="add-btn"]'
    },

    __addClicked : function () {
        Shredr.vent.trigger('resources:addBtn:clicked');
    },

    __scalesClicked : function () {
        Shredr.vent.trigger('resources:scales:clicked');
        this.ui.button.text('Add Scale');
    }
});

return ResourcesKickerView;
});
