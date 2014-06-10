/* global define */
define([
    'backbone',
    'models/battle',
    'views/battle/battleDetailLayout',
    'views/battle/preBattleAnimation'
],
function (
    Backbone,
    Battle,
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

                // show animation
                this.showPreBattleAnimation(battle);
                Shredr.setModel(battle);
            }.bind(this)
        });
    },

    showPreBattleAnimation : function (model) {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        var preBattleView = new PreBattleAnimationView({model : model});
        this.listenToOnce(preBattleView, 'preBattleAnimation:done',
             Shredr.baseController.closeModal.bind(Shredr.baseController, 'hi-opac' ));

        Shredr.baseController.showModal(preBattleView, 'hi-opac');
    }
});

return BattlesController;
});
