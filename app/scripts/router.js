// One router for all app routes
define([
    'backbone.marionette',
    'controllers/shredsController',
    'controllers/battlesController',
    'controllers/usersController',
    'controllers/workspaceController'
], function (
    Marionette,
    ShredsController,
    BattlesController,
    UsersController,
    WorkspaceController
) {

    var Router = Marionette.AppRouter.extend({
        initialize : function () {
            this.shredsController = new ShredsController();
            this.battlesController = new BattlesController();
            this.usersController = new UsersController();
            this.workspaceController = new WorkspaceController();
        },

        routes : {
            'stage/shreds' : 'listShreds',
            'stage/users'  : 'listUsers',
            'battle/:id'   : 'showBattle',
            'shred/:id'    : 'showShred',
            'users/edit'   : 'editUser',
            'users/:id'    : 'showUser',
            'workspace'    : 'showWorkspace',
            '*all'         : 'listShreds'
        },

        listShreds : function () {
            this.shredsController.showStageShreds();
        },

        listUsers : function () {
            this.usersController.showStageUsers();
        },

        showUser : function (id) {
            this.usersController.showUser(id);
        },

        editUser : function () {
            this.usersController.showEditUser();
        },

        showBattle : function (id) {
            this.battlesController.showBattleDetail(id);
        },

        showShred : function (id) {
            this.shredsController.showShred(id);
        },

        showWorkspace : function () {
            this.workspaceController.show();
        }

    });

    return Router;
});
