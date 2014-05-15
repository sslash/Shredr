/* global define */
define([
    'backbone',
    'hbs!tmpl/battle/battleDetailLayout'
],
function (
    Backbone,
    Tpl
){
'use strict';
var BattleDetailLayout = Backbone.Marionette.Layout.extend({
    el : $('[data-region="landing"]'),
    template : Tpl,

    events : {
        'click [data-evt="rel-bat"]' : '__relatedBattleClicked'
    },

    serializeData : function () {
        var model = this.model.toJSON();
        return {
            m : model,
            roundNo : model.rounds.length,
            things : this.collection.toJSON(),
            round : model.rounds[model.rounds.length-1]
        };
    },

    __relatedBattleClicked : function (e) {
        console.log('battle clicked');
        var id = $(e.currentTarget).attr('data-mod');
        Shredr.navigate('battle/' + id, {trigger: true});
    }
});

return BattleDetailLayout;
});
