/* global require */
define([
    'backbone'
],function ( Backbone){
    'use strict';
    var User = Backbone.Model.extend({
        urlRoot : 'users/session',

        login : function (attrs) {
            attrs = attrs || {};
            attrs.event = 'auth:save';
            Shredr.baseController.exec(this, 'save', attrs);
        },

        logout : function () {
            $.get('/logout');
        }
    });
return User;
});
