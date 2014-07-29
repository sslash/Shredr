/* global define */
define([
    'backbone',
    'hbs!tmpl/user/userKickerView'
],
function (
    Backbone,
    Tpl
){
'use strict';
var UserKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,
    className : 'txt-center',

    serializeData : function () {
        var model = this.model.toJSON();
        return {
            following: model.fanees.length,
            followers: model.fans.length,
            shreds : model.shreds.length,
            battles : model.battles.length,
            m : model
        };
    },

    events : {
        'click [data-evt="drop"] li' : '__dropdownClicked'
    },

    __dropdownClicked : function (e) {
        var category = $(e.currentTarget).attr('data-mod');
        $(e.currentTarget).find('.dropdown').toggle();
    }
});

return UserKickerView;
});
