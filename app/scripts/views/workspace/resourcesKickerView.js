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
        'click [data-evt="category"]' : '__categoryClicked',
        'click [data-mod="add-btn"]': '__addClicked'
    },

    ui : {
        button : '[data-mod="add-btn"]'
    },

    // Add a Jamtrack, scale, theory or chord item
    // depending on where ur at yo
    __addClicked : function () {
        Shredr.vent.trigger('resources:addBtn:clicked');
    },

    // Navigating to scales section
    __categoryClicked : function (e) {
        var category = $(e.currentTarget).attr('data-mod');
        Shredr.vent.trigger('resources:' + category + ':clicked');

        this.setButtonText(category);
    },

    setButtonText : function (category) {
        switch(category) {
            case 'scales' : this.ui.button.text('Add Scale'); break;
            default : this.ui.button.text('Add Jamtrack');
        }
    }
});

return ResourcesKickerView;
});
