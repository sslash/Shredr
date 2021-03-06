/* global define */
define([
    'backbone',
    'models/battle',
    'views/battle/battleDetailLayout',
    'views/battle/preBattleAnimation',
    'views/stage/stageBattlesLayout',
],
function (
    Backbone,
    Battle,
    BattleDetailsLayout,
    PreBattleAnimationView,
    StageBattlesLayout
){
'use strict';
var BattlesController = Backbone.Marionette.Controller.extend({

    showStageBattles : function () {
        Shredr.baseController.renderMainRegion(StageBattlesLayout, {collection : Shredr.collection}, 'battles');
        Shredr.vent.trigger('battles:stage:render', Shredr.collection);
    },

    showBattleDetail : function (id) {
        Shredr.baseController.exec( new Battle({id : id}), 'fetch',
        {
            event : 'battle:fetch',
            success : function (battle, response, options) {

                Shredr.baseController.renderMainRegion(BattleDetailsLayout, {
                        model : battle, collection : Shredr.collection }, 'battles');

                // show animation
                this.showPreBattleAnimation(battle);
            }.bind(this),
            type : 'model'
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
