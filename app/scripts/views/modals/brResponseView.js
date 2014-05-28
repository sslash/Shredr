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
            this.model.fetch();
            this.listenTo(this.model, 'sync', this.renderBattleRequest);
            this.listenTo(this.model, 'battleRequest:accept:success', this.acceptSuccess);
            this.listenTo(this.model, 'battleRequest:decline:success', this.declineSuccess);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-event="play"]' :    '__playClicked',
            'click [data-event="stop"]' :    '__stopClicked',
            'click [data-event="accept"]' :  '__acceptClicked',
            'click [data-event="decline"]' : '__declineClicked',
            'click [data-event="done"]'    : '__doneClicked'
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

            function tryRender () {
                if ( video.readyState < 3 || audio.readyState < 3) {
                    setTimeout(tryRender.bind(this), 40);
                } else {
                    this.vpComponent = new VPComponent({
                        videos : [{
                            sel : video,
                            vidStartSec: this.model.get('startSec'),
                            vidStartFramesOffset: this.model.get('startFrame')
                        }],
                        audio : audio
                    });
                }
            }
            tryRender.call(this);
        },

        // goto battle view
        acceptSuccess : function (battle) {
            this.battle = new Battle(battle);
            var $el = this.$('[data-reg="content"]');
            $el.children().remove()
            $el.append([
                '<p class="pam lead">Battle accepted. It\'s on!</p>',
                '<button data-event="done" class="btn btn-niz">Go To Battle</button>'
                ].join('')
            );
        },

        declineSuccess : function (battle) {
            this.__closeClicked();
        },

        // EVENTS
        __acceptClicked : function () {
            //this.model.acceptRequest();
            this.acceptSuccess();
        },

        __doneClicked : function () {
            Shredr.router.navigate('battle/' + this.battle.get('_id'));
        },

        //TODO: CREATE DECLINING
        __declineClicked : function () {
            this.declineSuccess();
            //this.model.declineRequest();
        },

        __playClicked : function () {
            this.vpComponent.trigger('player:play');
        },

        __stopClicked : function () {
            this.vpComponent.trigger('player:stop');
        }

    });

    return LoginModalView;
});
