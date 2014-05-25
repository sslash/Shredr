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

    events : {
        'click [data-mod="filters"] span' : '__filterClicked'
    },

    __filterClicked : function (e) {
        var $curr = $(e.currentTarget);
        this.$('.active').removeClass('active');
        $curr.addClass('active');
        var val = $curr.attr('data-model');

        this.collection.setQuery({type : val});
        Shredr.baseController.exec(this.collection, 'fetch');
    }
});

return StageShredsKickerView;
});
