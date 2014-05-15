/* global define */
define([
    'backbone',
    'views/stage/stageShredsKickerView',
    'views/stage/stageShredsLayout'
],
function (
    Backbone,
    StageShredsKickerView,
    StageShredsLayout
){
'use strict';
var ShredsController = Backbone.Marionette.Controller.extend({

    showStageShreds : function () {

        var kickerView = new StageShredsKickerView({collection : Shredr.collection});
        Shredr.kickerRegion.show(kickerView);

        Shredr.baseController.renderMainRegion(StageShredsLayout, {collection : Shredr.collection}, 'shreds');
    }
});

return ShredsController;
});
