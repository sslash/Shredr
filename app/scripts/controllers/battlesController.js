/* global define */
define([
    'backbone',
    'models/battle',
    'views/battle/battleDetailKickerView',
    'views/battle/battleDetailLayout',
    'views/battle/preBattleAnimation'
],
function (
    Backbone,
    Battle,
    BattleDetailKickerView,
    BattleDetailsLayout,
    PreBattleAnimationView
){
'use strict';
var BattlesController = Backbone.Marionette.Controller.extend({

    showBattleDetail : function () {
        var model = new Battle(Shredr.model);

        var kickerView = new BattleDetailKickerView({model : model});
        Shredr.kickerRegion.show(kickerView);

        // var stageLayout = new BattleDetailsLayout();

        Shredr.baseController.renderMainRegion(BattleDetailsLayout,{
            model : model,
            collection : Shredr.collection
        }, 'battles');

        // show animation
        var preBattleView = new PreBattleAnimationView({model : model});
        this.listenToOnce(preBattleView, 'preBattleAnimation:done',
             Shredr.baseController.closeModal.bind(Shredr.baseController, 'hi-opac' ));

        Shredr.baseController.showModal(preBattleView, 'hi-opac');
    }
});

return BattlesController;
});
