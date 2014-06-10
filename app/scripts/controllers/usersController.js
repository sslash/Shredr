/* global define */
define([
'backbone',
'models/user',
'views/stage/stageUsersLayout',
'views/user/userLayout'
],
function (
    Backbone,
    User,
    StageUsersLayout,
    UserLayout
){
    'use strict';
    var UserController = Backbone.Marionette.Controller.extend({

        showStageUsers : function () {
            Shredr.baseController.renderMainRegion(StageUsersLayout, {collection : Shredr.collection}, 'users');
            Shredr.vent.trigger('users:stage:render', Shredr.collection);
        },

        showUser : function (id) {

            Shredr.baseController.exec( new User({id : id}), 'fetch',
                {
                    event : 'user:fetch',
                    success : function (user, response, options) {

                        Shredr.baseController.renderMainRegion(UserLayout, {model : user}, 'users');
                        Shredr.setModel(user);
                        Shredr.vent.trigger('users:layout:render', Shredr.model);
                    },
                    type : 'model'
                }
            );
        }
    });

    return UserController;
});
