/* global define */
define([
    'backbone',
    'hbs!tmpl/stage/feedView',
    'hbs!tmpl/stage/feedLINView'
],
function (
    Backbone,
    Tpl,
    linTpl
){
'use strict';
var FeedView = Backbone.Marionette.ItemView.extend({

    events : {
        'click [data-event="login"]' : '__loginClicked'
    },

    serializeData : function () {
        return Shredr.user.toJSON();
    },

    getTemplate : function () {
        if ( Shredr.authController.isLoggedIn() ) {
            return linTpl;
        } else {
            return Tpl;
        }
    },

    __loginClicked : function () {
        Shredr.vent.trigger('loginModal:show');
    }
});

return FeedView;
});
