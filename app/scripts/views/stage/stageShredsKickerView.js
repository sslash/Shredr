/* global define */
define([
    'backbone',
    'hbs!tmpl/stage/stageShredsKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var StageShredsKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,

    ui : {
        more : '[data-reg="more"]'
    },

    events : {
        'click [data-mod="filters"] span' : '__filterClicked',
        'click [data-evt="more"]'         : '__moreClicked'
    },

    __filterClicked : function (e) {
        var $curr = $(e.currentTarget);
        this.$('.active').removeClass('active');
        $curr.addClass('active');
        var val = $curr.attr('data-model');

        this.collection.setQuery({type : val});
        Shredr.baseController.exec(this.collection, 'fetch');
    },

    __moreClicked : function () {
        this.$('[data-reg="more"]').slideDown();
    }
});

return StageShredsKickerView;
});
