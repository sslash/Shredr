// One router for all app routes
define([
    'backbone.marionette',
    'controllers/shredsController',
    'controllers/battlesController'
], function ( Marionette, ShredsController, BattlesController ) {

    var Router = Marionette.AppRouter.extend({
        initialize : function () {
            this.shredsController = new ShredsController();
            this.battlesController = new BattlesController();
        },

        routes : {
            'stage/shreds' : 'listShreds',
            'battle/:id'   : 'showBattle',
            'shred/:id'    : 'showShred',
            '*all'         : 'listShreds'
        },

        listShreds : function () {
            this.shredsController.showStageShreds();
        },

        showBattle : function (id) {
            this.battlesController.showBattleDetail(id);
        },

        showShred : function (id) {
            this.shredsController.showShred(id);
        }

    });

    return Router;
});
