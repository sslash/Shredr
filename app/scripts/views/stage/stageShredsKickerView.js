/* global define */
define([
    'backbone',
    'views/globals/kickerRegionView',
    'hbs!tmpl/stage/stageShredsKickerView'
],
function (
    Backbone,
    KickerRegionView,
    Tpl
){
'use strict';
var StageShredsKickerView = KickerRegionView.extend({

    events : {
        'click [data-mod="filters"] span' : '__filterClicked'
    },

    onRender : function () {
        this.ui.kicker.append(Tpl());
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
