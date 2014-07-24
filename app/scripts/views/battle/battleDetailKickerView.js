/* global define */
define([
    'backbone',
    'views/modals/uploadBattleAdvVideoView',
    'views/modals/uploadBattleSmplVideoView',
    'components/searchComponent',
    'hbs!tmpl/battle/battleDetailKickerView'
],
function (
    Backbone,
    UploadBattleVideoView,
    UploadBattleSmplVideoView,
    SearchComponent,
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
        this.setStatusMsg();
        this.searchCmp = new SearchComponent({
            region : this.$('[data-reg="search"]'),
            collection : Shredr.collection
        }).show();
    },

    onClose : function () {
        this.searchCmp.destroy();
    },

    setStatusMsg : function () {
        var status = this.model.getBattleStatus(), html;
        switch(status) {
            case 'complete':
                html = '<figcaption class="fat error in">' +
                    '<img src="/img/trophy.png" class="logo-sm left mhm">' +
                    ' Battle is Finished</figcaption>';
                break;
            case 'finalRoundDone' :
                html = '<figcaption class="fat error in">All rounds are done!</figcaption>' +
                        '<p class="small">Battle completes when voting period is over.</p>';
                break;
            case 'usersTurn' :
                html = '<button class="btn btn-ser btn-small">Your turn!</button>';
                break;
            default: break;
        }
        this.ui.mid.html(html);
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
