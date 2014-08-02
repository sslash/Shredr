/* global require */
define([
    'backbone',
    'views/modals/baseModalLayout',
    'views/badges/baseBadge',
    'models/user',
    'models/badge',
    'libs/utils',
    'hbs!tmpl/modals/loginModalView',
    'hbs!tmpl/modals/loginModalLogin',
    'hbs!tmpl/modals/loginModalRegister',
    'hbs!tmpl/modals/loginModalRegisterSuccess'
],
function (
    Backbone,
    BaseModalLayout,
    BaseBadgeView,
    User,
    Badge,
    utils,
    Tpl,
    loginTpl,
    regTpl,
    regSuccessTpl
){
'use strict';
var LoginModalView = BaseModalLayout.extend({

    initialize : function (opts) {
        BaseModalLayout.prototype.initialize.apply(this, arguments);
        this.formType = 'login';
        this.model = new User();
        this.listenTo(this.model, 'sync', this.modelSavedSuccess);
        this.listenTo(Shredr.vent, 'auth:save:success', this.modelLoginSuccess);
        this.listenTo(this.model, 'invalid', this.modelSaveFail);
        this.listenTo(this.model, 'save:fail:post', this.modelSaveFail);
    },

    events : _.extend({}, BaseModalLayout.prototype.events, {
        'click .tab-btn'               : '__tabBtnClicked',
        'submit form#register-form'    : '__registerSubmitted',
        'submit form#login-form'       : '__loginFormSubmitted',
        'click [data-event="no-link"]' : '__closeClicked',
        'click [data-event="ok-btn"]'  : '__editProfileClicked',
        'click [data-evt="face"]'      : '__faceClicked'
    }),

    onRender : function () {
        BaseModalLayout.prototype.onRender.apply(this, arguments);
        this.ui.body.html(Tpl);
        this.renderForm('login');
    },

    renderForm : function (formType) {
        utils.execFadeOutIn(
            this.$('[data-reg="content"]'),
            formType === 'login' ? loginTpl : regTpl
        );
    },

    swapTemplate : function (formType) {
        this.formType = formType;
        this.renderBody();
    },

    modelSavedSuccess : function () {
        Shredr.authController.loginUser(this.model);
        Shredr.baseController.hideShowNewModal(new BaseBadgeView({
            model : new Badge(this.model.get('flash').badges[0]),
            tpl : 'theNovice',
            classes : 'modal-short form-dark'
        }));
    },

    modelLoginSuccess : function () {
        this.__closeClicked();
    },

    // TODO: show all error messages here
    modelSaveFail : function (model, msg) {
        msg = _.isArray(msg) ? msg : [msg];
        this.$('[data-model="error-msg"]').text(msg[0]).show();
    },

    __loginFormSubmitted : function (e) {
        e.preventDefault();
        Shredr.authController.createAuth({
            username : this.$('#emailInput').val(),
            password : this.$('#passwordInput').val(),
        });
    },

    __registerSubmitted : function (e) {
        e.preventDefault();
        this.model.create({
            username : this.$('#username').val(),
            email : this.$('#email').val(),
            password : this.$('#pw1').val(),
            password2 : this.$('#pw2').val()
        });
    },

    __tabBtnClicked : function (e) {
        var $ct = $(e.currentTarget);
        this.renderForm($ct.attr('data-model'));
        this.$('.active').removeClass('active');
        $ct.addClass('active');
    },

    __editProfileClicked : function (e) {
        e.preventDefault();
        this.__closeClicked();
        setTimeout(function() {
            Shredr.navigate('/users/edit', {trigger : true});
        }, 200);
    },

    __faceClicked : function () {
        window.location = '/auth/facebook';
    }
});

return LoginModalView;
});
