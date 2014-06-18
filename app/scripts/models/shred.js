define([
	'backbone'
	],
	function( Backbone ) {
		'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		urlRoot : '/api/shreds/',

		defaults: {
			title : 'Untitled Shredr Video',
			"tabs" : {
				"tempo" : "125",
				"tabs" : [
				// {
				// 	// this is the correct data structure
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 9,
				// 		"1" : 14,
				// 		"2" : 14,
				// 		"3" : 12,
				// 		"4" : 14,
				// 		"5" : 14,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 12,
				// 		"1" : 14,
				// 		"2" : 14
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 15,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"2" : 11
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"5" : 1,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"4" : 10,
				// 	}
				// },
				// {
				// 	// this is the correct data structure
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 12,
				// 		"1" : 14,
				// 		"2" : 14,
				// 		"3" : 12,
				// 		"4" : 14,
				// 		"5" : 14,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 12,
				// 		"1" : 14,
				// 		"2" : 14
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 15,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"2" : 11
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"5" : 1,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"4" : 10,
				// 	}
				// },
				// {
				// 	// this is the correct data structure
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 12,
				// 		"1" : 14,
				// 		"2" : 14,
				// 		"3" : 12,
				// 		"4" : 14,
				// 		"5" : 14,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 12,
				// 		"1" : 14,
				// 		"2" : 14
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"0" : 15,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"2" : 11
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"5" : 1,
				// 	}
				// },
				// {
				// 	"rest" : 4,
				// 	"stringz" : {
				// 		"4" : 10,
				// 	}
				// }
				],
			},
			userHasRated : false
		},

		getUploadUrl : function () {
			return this.url() + '/upload';
		},

		parse : function(response, options) {

			// This only works in EcmaScript 5 ++
			if ( response.rating ) {
				if ( Object.keys(response.rating).length === 0) {
					response.rateValue = 0;
				} else {
					response.rateValue = this.setRateValue(response.rating);
				}
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

		getNumberOfViewers : function (views) {
			views = views || this.get('views') || {};
			return Object.keys(views).length;
		},

		validate : function (attrs) {
			if ( !attrs.title || attrs.title.length === 0 ){
				return 'Title must be included';
			}
			if ( !attrs.description || attrs.description.length === 0 ){
				return 'Description must be included';
			}
		},

		getUserId : function () {
			return this.get('user')._id || this.get('user').id;
		},


		/** API FUNCTIONS **/


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

		tryIncreaseView : function () {
			var url = this.url() + '/hej_jeg_kigger';
			var that = this;
			$.post(url)
			.done(function(res) {
				that.set({views : res.views})
			});
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

		getRating : function () {
			var rating = this.get('rating');
			var raters = rating.raters || {}
			return (rating.rating / Object.keys(raters).length) || 0;
		}
	});
});
