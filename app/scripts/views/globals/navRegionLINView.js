// TODO: build a base nav view that this one extends.
// the base nav is used for non-logged in users
/* global define Shredr */
define([
    'backbone',
    'views/globals/navRegionView',
    'models/battleRequest',
    'views/modals/brResponseView',
    'views/globals/notificationLayout',
    'hbs!tmpl/globals/navRegionLIN'
],
function (
    Backbone,
    NavRegionView,
    BattleRequest,
    BrResponseView,
    NotificationLayout,
    tpl
){
'use strict';
var NavRegionView = NavRegionView.extend({
    template : tpl,

    events : {
        'click [data-evt="logout"]'      : '__logoutClicked',
        'click [data-evt="bodyClk"]'     : '__bodyClicked',
        'click [data-evt="menu"]'        : '__menuClicked',
        'mouseleave [data-reg="menu-body"]'   : '__menuMouseLeave',
        'click [data-evt="clear"]'       : '__menuMouseLeave',
        'click [data-evt="editProfile"]' : '__editProfileClicked'
    },

    serializeData : function () {
        var user = Shredr.user.toJSON();
        return { user : user };
    },

    regions : {
      notifications : '[data-reg="notifications"]'
    },

    ui : { body : '[data-reg="menu-body"]'},

    onRender : function () {
      this.notifications.show(new NotificationLayout({model : Shredr.user}));
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
        this.ui.body.hide();
    },

    __logoutClicked : function (e) {
        e.preventDefault();
        Shredr.authController.logoutUser();
    },

    __menuClicked : function (e) {
        e.preventDefault();
        this.ui.body.toggle();
    },

    __editProfileClicked : function (e) {
        e.preventDefault();
        Shredr.navigate('/users/edit', {trigger : true});
    }
});

return NavRegionView;
});
