/* global define */
define([
    'backbone',
    'views/shred/shredDetailKickerView',
    'views/stage/stageShredsKickerView',
    'views/battle/battleDetailKickerView',
    'hbs!tmpl/globals/kickerRegion'
],
function (
    Backbone,
    ShredDetailKickerView,
    StageShredsKickerView,
    BattleDetailKickerView,
    Tpl
){
'use strict';
var KickerRegionView = Backbone.Marionette.Layout.extend({
    template : Tpl,
    className : 'kicker',
    // ui : {
    //     kicker : '[data-mod="kicker"]',
    //     mid : '[data-mod="mid"]',
    //     right : '[data-mod="right"]'
    // },

    regions : {
        wrap : '[data-reg="wrap"]'
    },

    initialize : function () {
        this.listenTo(Shredr.vent, 'shred:stage:render', this.showShredStageKicker);
        this.listenTo(Shredr.vent, 'shred:fetch:success', this.showShredKicker);
        this.listenTo(Shredr.vent, 'battle:fetch:success', this.showBattleKicked);
    },

    showShredStageKicker : function (collection) {
        this.stageKickerView = new StageShredsKickerView({collection : collection});
        this.wrap.show(this.stageKickerView);

    },

    showShredKicker : function (model) {
        this.wrap.show(new ShredDetailKickerView({model : model}));
    },

    showBattleKicked : function (battle) {
        this.battleKickerView = new BattleDetailKickerView({model : battle});
        this.wrap.show(this.battleKickerView);
    }
});

return KickerRegionView;
});
