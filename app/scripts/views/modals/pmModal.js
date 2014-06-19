/* global require */
define([
'backbone',
'views/modals/baseModalLayout',
'models/conversation',
'hbs!tmpl/modals/pmModalView'
],
function (
    Backbone,
    BaseModalLayout,
    Conversation,
    tpl
){
    'use strict';
    var PmModalView = BaseModalLayout.extend({

        initialize : function (opts) {
            BaseModalLayout.prototype.initialize.apply(this, arguments);
        },

        onRender : function () {
            BaseModalLayout.prototype.onRender.apply(this, arguments);
            this.ui.body.html(tpl(this.model.toJSON()));
        },

        events : _.extend({}, BaseModalLayout.prototype.events, {
            'click [data-evt="send"]' : '__sendClicked'
        }),

        __sendClicked : function () {
            new Conversation({recipient : this.model.get('_id')})
            .createAndSendNew({ body : this.$('textarea').val() });
            this.listenTo(Shredr.vent,'conv:save:success', this.__closeClicked);
        }
    });

    return PmModalView;
});
