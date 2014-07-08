/* global require */
define([
    'backbone'
],function ( Backbone){
    'use strict';
    var User = Backbone.Model.extend({
        urlRoot : '/api/user/',
        defaults : {
            location : 'Planet Earth'
        },

        initialize : function () {
            if ( this.get('_id') ) { this.id = this.get('_id'); }
        },

        parse : function (attrs) {
            this.id = attrs._id;
            return attrs;
        },

        create : function (attrs) {
            if ( attrs.password !== attrs.password2 ) {
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
        },

        clearNotifications : function () {
            var dat = this;
            $.post(this.url() + '/clearNotifications')
            .done(function(res) {
                dat.set('notifications', []);
                Shredr.vent.trigger('user:clearNotifications:success', res);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                Shredr.vent.trigger('user:clearNotifications:fail', textStatus);
            });
        },

        getUserStuff : function () {
            var dat = this;
            $.get(this.url() + '/getUserStuff')
            .done(function(res) {
                dat.set(res);
                Shredr.vent.trigger('user:getUserStuff:success', res);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                Shredr.vent.trigger('user:getUserStuff:fail', textStatus);
            });
        },

        getUploadUrl : function () {
            return this.url() + '/upload';
        }
    });
return User;
});
