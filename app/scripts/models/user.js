/* global require */
define([
    'backbone'
],function ( Backbone){
    'use strict';
    var User = Backbone.Model.extend({
        urlRoot : '/api/user/',

        create : function (fb, attrs) {
            if ( !fb && (attrs.password !== attrs.password2) ) {
                return this.trigger('invalid', this, 'Passwords are not equal');
            }

            Shredr.baseController.exec(this, 'save', {attrs : attrs});
        },

        postMsg : function (opts) {
			$.post(opts.url, opts.body)
			.done(function(res) {
				Shredr.vent.trigger(opts.event + ':success', res);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				Shredr.vent.trigger(opts.event + ':fail', textStatus);
			});
		},


		addFan : function (faneeId) {
			this.postMsg({
				url : this.url() + this.get('_id') + '/addFan/' + faneeId,
				body : {},
				event : 'user:addFan'
			});
		},

        isFanOf : function (otherUserId) {
            return _.any(this.get('fanees'), function(fanee) {  return fanee.user === otherUserId; });
        }
    });
return User;
});
