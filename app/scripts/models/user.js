/* global require */
define([
    'backbone'
],function ( Backbone){
    'use strict';
    var User = Backbone.Model.extend({
        urlRoot : '/api/user/',

        create : function (fb, attrs) {
            if ( !fb && (attrs.password !== attrs.password2) ) {
                return this.trigger('invalid', this, 'Passwords are not equal');
            }

            Shredr.baseController.exec(this, 'save', {attrs : attrs});
        }
    });
return User;
});
