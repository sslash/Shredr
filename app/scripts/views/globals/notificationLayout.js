/* global require */
define([
    'backbone',
    'models/battleRequest',
    'models/conversation',
    'views/modals/conversationModalLayout',
    'views/modals/brResponseView',
    'hbs!tmpl/globals/notificationLayout'
],
function (
    Backbone,
    BattleRequest,
    Conversation,
    ConversationModalLayout,
    BrResponseView,
    tpl
){
'use strict';
var NotificationModal = Backbone.Marionette.Layout.extend({
    template : tpl,className:'rel',

    initialize : function (opts) {
        this.extraClasses = opts.classes || '';
        this.listenTo(Shredr.vent, 'user:getUserStuff:success', this.render);
    },

    events : {
        'click [data-evt="not"]'  : '__notificationsClicked',
        'click [data-evt="drop"]' : '__dropdownClicked',
        'click [data-evt="clear"]': '__clearClicked'
    },

    ui : { body : '[data-reg="body"]'},

    serializeData : function () {
      return {
        notLen : this.model.get('notifications').length,
        m : this.model.toJSON()
      };
    },

    onRender : function () {
        this.$el.addClass(this.extraClasses);
    },

    onShow : function () {},

    actions : {

        'New Fan' : function (notification) {
            Shredr.navigate('/users/' + notification.referenceId, {trigger : true});
        },

        'New Battle Request' : function(notification) {
            var model = new BattleRequest({id : notification.referenceId});
            Shredr.baseController.exec(model, 'fetch');
            var view = new BrResponseView({model : model, classes : 'modal-short form-dark'});
            Shredr.baseController.showModal(view);
        },

        'Battle Request Accept' : function(notification) {
            Shredr.navigate('/battle/' + notification.referenceId, {trigger : true});
        },

        'Battle Finished' : function(notification) {
            Shredr.navigate('/battle/' + notification.referenceId, {trigger : true});
        },

        'Battle Request Decline' : function(notification) {
            Shredr.navigate('/users/' + notification.referenceId, {trigger : true});
        },

        'New Message' : function(notification) {
            var model = new Conversation({id : notification.referenceId});
            Shredr.baseController.exec(model, 'fetch');
            var view = new ConversationModalLayout({model : model, classes : 'modal-med form-dark'});
            Shredr.baseController.showModal(view);
        }
    },

    __notificationsClicked : function (e) {
        var index = parseInt($(e.currentTarget).attr('data-mod'),10);
        var notification = this.model.get('notifications')[index];
        this.actions[notification.type](notification);
        this.__dropdownClicked();
    },

    __dropdownClicked : function () {
      this.ui.body.toggle();
      this.setSeenOnNotifications();
    },

    setSeenOnNotifications : function () {
        var $btn = this.$('[data-mod="btn"]');
        $btn.addClass('non');
        //$btn.text('0');
    },

    __clearClicked : function (e) {
        e.preventDefault();
        Shredr.user.clearNotifications();
        this.listenTo(Shredr.vent, 'user:clearNotifications:success', this.render);
    }
});

return NotificationModal;
});
