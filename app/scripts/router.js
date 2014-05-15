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
            '*all' : 'listShreds'
        },

        listShreds : function () {
            this.shredsController.showStageShreds();
        },

        showBattle : function (id) {
            this.battlesController.showBattleDetail();
        }

    });

    return Router;
});
