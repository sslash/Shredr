/* global require */
define([
'backbone',
'views/modals/baseModalLayout',
'models/battle',
'components/battlePlayerComponent',
'hbs!tmpl/modals/brResponseView'
],
function (
    Backbone,
    BaseModalLayout,
    Battle,
    VPComponent,
    Tpl
){
    'use strict';
    var LoginModalView = BaseModalLayout.extend({

        initialize : function (opts) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model, 'sync', this.renderBattleRequest);
            this.listenTo(this.model, 'battleRequest:accept:success', this.acceptSuccess);
            this.listenTo(this.model, 'battleRequest:decline:success', this.declineSuccess);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="play"]' :    '__playClicked',
            'click [data-evt="stop"]' :    '__stopClicked',
            'click [data-evt="accept"]' :  '__acceptClicked',
            'click [data-evt="decline"]' : '__declineClicked',
            'click [data-evt="done"]'    : '__doneClicked'
        }),

        onRender : function () {
            BaseModalLayout.prototype.onRender.apply(this, arguments);
            this.ui.body.html(Tpl(this.model.toJSON()));
        },

        renderBattleRequest : function () {
            this.render();
            if ( this.model.get('mode') === 'Advanced' ) {
                this.renderVideoPlayer();
            }
        },

        renderVideoPlayer : function () {
            var video = this.$('video')[0];
            var audio = this.$('audio')[0];

            this.vpComponent = new VPComponent({
                videos : [{
                    sel : video,
                    vidStartSec: this.model.get('startSec'),
                    vidStartFramesOffset: this.model.get('startFrame')
                }],
                audio : audio,
                uploadMode : true // dont hide video as u play
            });
        },

        // goto battle view
        acceptSuccess : function (battle) {
            this.battle = new Battle(battle);
            this.showFinalMsg([
                '<p class="pam lead">Battle accepted. It\'s on!</p>',
                '<button data-evt="done" class="btn btn-niz">Go To Battle</button>'
                ].join(''));
        },

        declineSuccess : function (battle) {
            this.showFinalMsg([
                '<p class="pam lead">Battle declined.</p>',
                '<button data-evt="done" class="btn btn-niz">Ok.</button>'
                ].join(''));
        },

        showFinalMsg : function (html) {
            var $el = this.$('[data-reg="content"]');
            $el.children().remove()
            $el.append(html);
        },

        // EVENTS
        __acceptClicked : function () {
            this.model.acceptRequest();
            //this.acceptSuccess();
        },

        __doneClicked : function () {
            if ( this.battle) {
                Shredr.router.navigate('battle/' + this.battle.get('_id'));
            }
            this.__closeClicked();
        },

        //TODO: CREATE DECLINING
        __declineClicked : function () {
            // this.declineSuccess();
            this.model.declineRequest();
        },

        __playClicked : function () {
            this.vpComponent.play();
        },

        __stopClicked : function () {
            this.vpComponent.trigger('player:stop');
        }

    });

    return LoginModalView;
});
