/* global define */
define([
    'backbone',
    'views/modals/uploadBattleAdvVideoView',
    'views/modals/uploadBattleSmplVideoView',
    'hbs!tmpl/battle/battleDetailKickerView'
],
function (
    Backbone,
    UploadBattleVideoView,
    UploadBattleSmplVideoView,
    tpl
){
'use strict';
var BattleDetailKickerView = Backbone.Marionette.ItemView.extend({
    template : tpl,

    initialize : function () {
        this.listenTo(this.model, 'change:rounds', this.render);
    },

    events : {
        'click button' : '__yourTurnClicked'
    },

    ui : {
        mid : '[data-mod="mid"]'
    },

    onRender : function () {
        if ( this.model.get('completed') === true ) {
            return this.ui.mid.html('<img src="/img/trophy.png" class="logo-sm left mhm">' +
                '<figcaption class="fat error in">Battle is Finished</figcaption>');
        }
        if ( this.model.isUsersTurn() ) {
            this.ui.mid.html('<button class="btn btn-ser btn-small">Your turn!</button>');
        }
    },

    serializeData : function () {
        var model = this.model.toJSON();

        return {
            m : model,
            roundNo : model.rounds.length
        };
    },

    __yourTurnClicked : function () {
        var opts = {
            model : this.model,
            classes : 'modal-wide ',
            heading : 'Upload your next battle video!'
        }, view;

        if ( this.model.get('mode') === 'Advanced' ) {
            opts.classes = 'modal-huge ';
            view = new UploadBattleVideoView(opts);
        } else {
            view = new UploadBattleSmplVideoView(opts);
        }

        Shredr.baseController.showModal(view);
    }
});

return BattleDetailKickerView;
});
