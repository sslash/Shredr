// TODO: build a base nav view that this one extends.
// the base nav is used for non-logged in users
/* global define Shredr */
define([
    'backbone',
    'views/globals/navRegionView',
    'models/battleRequest',
    'views/modals/brResponseView',
    'hbs!tmpl/globals/navRegionLIN'
],
function (
    Backbone,
    NavRegionView,
    BattleRequest,
    BrResponseView,
    Tpl
){
'use strict';
var NavRegionView = NavRegionView.extend({
    template : Tpl,

    events : {
        'click [data-event="menu"]'      : '__menuClicked',
        'click [data-evt="logout"]'      : '__logoutClicked',
        'click [data-evt="nots"]'        : '__notificationsClicked',
        'click [data-evt="bodyClk"]'     : '__bodyClicked',
        'mouseleave [data-event="menu"]' : '__menuMouseLeave'
    },

    serializeData : function () {
        var user = Shredr.user.toJSON();
        return {
            user : user,
            notifications : user.notifications.length
        };
    },

    __notificationsClicked : function (e) {
        $(e.currentTarget).parent().find('.dropdown').show();
    },

    __menuClicked : function (e) {
        $(e.currentTarget).find('.dropdown').show();
    },

    __bodyClicked : function (e) {
        var index = $(e.currentTarget).attr('data-index');
        var notification = Shredr.user.get('notifications')[parseInt(index, 10)];

        if (notification.type === 'New Battle Request') {
            var model = new BattleRequest({ id : notification.referenceId });
            var view = new BrResponseView({ model:model });
            Shredr.baseController.showModal(view);
        }
    },

    __menuMouseLeave : function (e) {
        $(e.currentTarget).find('.dropdown').hide();
    },

    __logoutClicked : function (e) {
        e.preventDefault();
        Shredr.authController.logoutUser();
    }
});

return NavRegionView;
});
