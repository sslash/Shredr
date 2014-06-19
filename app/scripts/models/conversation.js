define(['backbone'],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		urlRoot : '/api/conversation/',
		defaults : {
			messages : [
				// body : 'Message body',
				// timestamp : new Date(),
				// from : 0 // 0 = originator, 1 = recipient
			],
			recipient : '',
			originator : ''
		},

        createAndSendNew : function (opts) {
            this.get('messages').push({
                body : opts.body,
                from : 0
            });
            Shredr.baseController.exec(this, 'save', {event : 'conv:save'});
        },

		// Send a message from Shredr.user to this.
		sendMessage : function (msgBody) {
			var user = Shredr.user.toJSON();

			var message = {
				body : msgBody,
				from : this.get('originator') === user._id ? 0 : 1
			};

			var that = this;
			var url = this.url() + '/sendMessage';
			$.post(url, {message : message})
			.done(function(res) {
				that.trigger('message:sent:success', res);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				that.trigger('message:sent:fail', textStatus);
			});
		}
	});
});
