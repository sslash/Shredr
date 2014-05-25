/* global define */
define([
    'backbone',
    'views/modals/uploadBattleVideoView',
    'hbs!tmpl/battle/battleDetailKickerView'
],
function (
    Backbone,
    UploadBattleVideoView,
    tpl
){
'use strict';
var BattleDetailKickerView = Backbone.Marionette.ItemView.extend({
    template : tpl,

    events : {
        'click button' : '__yourTurnClicked'
    },

    ui : {
        mid : '[data-mod="mid"]'
    },

    onRender : function () {
    //    if ( this.model.isUsersTurn() ) {
            this.ui.mid.html('<button class="btn btn-ser btn-small">Your turn!</button>');
    //    }
    },

    serializeData : function () {
        var model = this.model.toJSON();

        return {
            m : model,
            isUsersTurn : true, //this.model.isUsersTurn(),
            roundNo : model.rounds.length
        };
    },

    __yourTurnClicked : function () {
        var view = new UploadBattleVideoView({
            model : this.model,
            classes : 'modal-wide'
        });
        Shredr.baseController.showModal(view);
    }
});

return BattleDetailKickerView;
});
