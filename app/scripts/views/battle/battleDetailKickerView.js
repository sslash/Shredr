/* global define */
define([
    'backbone',
    'views/globals/kickerRegionView',
    'views/modals/uploadBattleVideoView',
    'hbs!tmpl/battle/battleDetailKickerView'
],
function (
    Backbone,
    KickerRegionView,
    UploadBattleVideoView,
    Tpl
){
'use strict';
var BattleDetailKickerView = KickerRegionView.extend({

    events : {
        'click button' : '__yourTurnClicked'
    },

    onRender : function () {
        this.ui.kicker.append(Tpl(this.serializeData()));
        this.ui.mid.html('<button class="btn btn-ser btn-small">Your turn!</button>');
        this.ui.right.html('<small class="white">Battle - ' + this.model.get('mode') + '</small>');
    },

    serializeData : function () {
        var model = this.model.toJSON();
        return {
            m : model,
            roundNo : model.roundNo
        }
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
