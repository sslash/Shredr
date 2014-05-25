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

    showBattleDetail : function (id) {
        Shredr.baseController.exec( new Battle({id : id}), 'fetch',
        {
            event : 'battle:fetch',
            success : function (battle, response, options) {

                Shredr.baseController.renderMainRegion(BattleDetailsLayout, {
                        model : battle, collection : Shredr.collection });

                // TODO! Change this. the main kicker view should listen to Shredr.event and render instead
                var kickerView = new BattleDetailKickerView({model : battle});
                Shredr.kickerRegion.show(kickerView);

                // show animation
                this.showPreBattleAnimation(battle);
                Shredr.model = battle;
            }.bind(this)
        });
    },

    showPreBattleAnimation : function (model) {
        var preBattleView = new PreBattleAnimationView({model : model});
        this.listenToOnce(preBattleView, 'preBattleAnimation:done',
             Shredr.baseController.closeModal.bind(Shredr.baseController, 'hi-opac' ));

        Shredr.baseController.showModal(preBattleView, 'hi-opac');
    }
});

return BattlesController;
});
