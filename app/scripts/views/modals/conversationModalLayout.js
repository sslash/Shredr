/* global require */
define([
'backbone',
'views/modals/baseModalLayout',
'models/conversation',
'hbs!tmpl/modals/conversationModalLayout',
'hbs!tmpl/modals/pmModalView'
],
function (
    Backbone,
    BaseModalLayout,
    Conversation,
    tpl,
    pmTpl
){
    'use strict';
    var PmModalView = BaseModalLayout.extend({

        initialize : function (opts) {
            this.listenTo(this.model,'sync', this.render);
            BaseModalLayout.prototype.initialize.apply(this, arguments);
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="send"]' : '__sendClicked'
        }),

        onRender : function () {
            BaseModalLayout.prototype.onRender.apply(this, arguments);
            this.ui.body.html(tpl(this.serializeData()));
            this.renderPmModal();
        },

        serializeData : function () {
            var model = this.model.toJSON();

            // change the "from" variable from num to actual user
            var messages = this.model.get('messages').map(function(msg) {
                var from = msg.from === '0' ?
                    model.originator : model.recipient;
                return {
                    from : from, body : msg.body
                };
            });

            return {
                m : model,
                messages : messages,
                recipient : this.model.getSendTo()
            };
        },

        renderPmModal : function () {
            var recepient = this.model.getSendTo();
            this.$('[data-reg="reply"]').html(pmTpl(recepient));
        },

        __sendClicked : function () {
            var body = this.$('textarea').val();
            this.model.sendMessage(body);
            this.listenTo(this.model, 'message:sent:success', this.render);
        }
    });

    return PmModalView;
});
