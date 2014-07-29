/* global define */
define([
    'backbone',
    'views/shred/shredDetailKickerView',
    'views/stage/stageShredsKickerView',
    'views/battle/battleDetailKickerView',
    'views/stage/stageUsersKickerView',
    'views/user/userKickerView',
    'views/workspace/resourcesKickerView',
    'views/stage/stageBattlesKickerView',
    'hbs!tmpl/globals/kickerRegion'
],
function (
    Backbone,
    ShredDetailKickerView,
    StageShredsKickerView,
    BattleDetailKickerView,
    StageUsersKickerView,
    UserKickerView,
    ResourcesKickerView,
    StageBattlesKickerView,
    Tpl
){
'use strict';
var KickerRegionView = Backbone.Marionette.Layout.extend({
    template : Tpl,
    className : 'kicker',

    ui : {
        workspace : '[data-reg="workspace"]',
    },

    regions : {
        wrap : '[data-reg="wrap"]'
    },

    initialize : function () {
        this.listenTo(Shredr.vent, 'shred:stage:render', this.showShredStageKicker);
        this.listenTo(Shredr.vent, 'users:stage:render', this.showUsersStageKicker);
        this.listenTo(Shredr.vent, 'battles:stage:render', this.showBattlesStageKicker);
        this.listenTo(Shredr.vent, 'users:layout:render', this.showUserKicker);
        this.listenTo(Shredr.vent, 'shred:fetch:success', this.showShredKicker);
        this.listenTo(Shredr.vent, 'battle:fetch:success', this.showBattleKicker);
        this.listenTo(Shredr.vent, 'workspace:resources:render', this.showResourcesKicker);
    },

    showShredStageKicker : function (collection) {
        var stageKickerView = new StageShredsKickerView({collection : collection});
        this.wrap.show(stageKickerView);
    },

    showUsersStageKicker : function (collection) {
        var stageKickerView = new StageUsersKickerView({collection : collection});
        this.wrap.show(stageKickerView);
    },

    showBattlesStageKicker : function (collection) {
        var view = new StageBattlesKickerView({collection : collection});
        this.wrap.show(view);
    },

    showResourcesKicker : function () {
        var view = new ResourcesKickerView();
        this.wrap.show(view);
        this.ui.workspace.hide();
    },

    showUserKicker : function (model) {
        var userKickerView = new UserKickerView({model : model});
        this.wrap.show(userKickerView);
    },

    showShredKicker : function (model) {
        this.wrap.show(new ShredDetailKickerView({model : model}));
    },

    showBattleKicker : function (battle) {
        var battleKickerView = new BattleDetailKickerView({model : battle});
        this.wrap.show(battleKickerView);
    }
});

return KickerRegionView;
});
