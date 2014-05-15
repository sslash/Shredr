/* global require */
define([
    'backbone',
    'models/auth',
    'models/user'
],
function (
    Backbone,
    Auth,
    User

){
'use strict';
var AuthController = Backbone.Marionette.Controller.extend({
    silentLogin : function (user) {
        Shredr.user = user;
    },

    loginUser : function (user) {
        this.silentLogin(user);
        Shredr.baseController.renderPage();
    },

    logoutUser : function () {
        new Auth().logout();
    },

    isLoggedIn : function () {
        return !Shredr.user.get('notLoggedIn');
    },

    createAuth : function(attrs) {
        new Auth(attrs).login();
        this.listenToOnce(Shredr.vent, 'auth:save:success', function (model) {
            this.loginUser( new User(model.toJSON()) );
            this.trigger('auth:save:success');
        });
    }
});

return AuthController;
});
