define([
	'backbone'
	],
	function( Backbone ) {
		'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		urlRoot : 'api/shreds/',

		defaults: {
			"tabs" : {
				"tempo" : "125",
				"tabs" : [
				{
					// this is the correct data structure
					"rest" : 4,
					"stringz" : {
						"0" : 12,
						"1" : 14,
						"2" : 14
					}
				},

					// this is not
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 4,
						"1" : 4,
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 10
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"4" : 4
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"5" : 5
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"3" : 0
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 4
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"4" : 2
					},
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 2
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : -1
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : -1
					},
					{
						"3" : -1
					},
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 8,
					"stringz" : [
					{
						"3" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"0" : 3
					},
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 3
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"1" : 22
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 22
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : -1
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				},
				{
					"rest" : 4,
					"stringz" : [
					{
						"2" : 2
					}
					]
				}
				],
			},
			userHasRated : false
		},

		getUploadUrl : function () {
			return this.url() + '/upload';
		},

		parse : function(response, options) {

			// This only works in EcmaScript 5 ++
			if ( Object.keys(response.rating).length === 0) {
				response.rateValue = 0;
			} else {
				response.rateValue = this.setRateValue(response.rating);
			}

			//
			if ( Shredr.user ) {
				if ( response.rating[Shredr.user.get('_id')] ) {
					response.userHasRated = response.rating[Shredr.user.get('_id')];
				}
			}

			if ( response._id ) {
				this.id = response._id;
			}

			return response;
		},

		setRateValue : function(rate) {
			var rateVal;
			if ( rate.raters ) {
				rateVal = rate.rating / (Object.keys(rate.raters).length);
			}else {
				rateVal = 0;
			}
			this.set({'rateValue' : rateVal});
			return rateVal;
		},

		validate : function (attrs) {
			if ( !attrs.title || attrs.title.length === 0 ){
				return 'Title must be included';
			}
			if ( !attrs.description || attrs.description.length === 0 ){
				return 'Description must be included';
			}
		},

		rate : function(rateVal) {
			var url = this.url() + '/rate?rating=' + rateVal;
			var that = this;
			$.post(url)
			.done(function(res) {
				that.set({userHasRated : true});
				that.setRateValue(res.rating);
				that.set({rating : res.rating});
			})
			.fail(function(err) {console.log('fail');});
		},

		addComment : function(comment) {
			if ( comment && comment.length > 0 ) {
				var url = this.url() + '/comment';
				var that = this;
				$.post(url, {comment : comment})
				.done(function(res) {

					// Don't set the comments. no need.
					// just append the new one to the current view
					var comment = res.comments[res.comments.length-1];
					that.trigger('leChange:commentAdded', comment);
				})
				.fail(function(err) {console.log('fail');});
			}
		},

		getUserId : function () {
			return this.get('user')._id || this.get('user').id;
		}
	});
});
