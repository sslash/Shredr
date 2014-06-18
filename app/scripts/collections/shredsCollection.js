/* global define */
define([
	'backbone',
	'models/shred'
],
function( Backbone, Shred ) {
    'use strict';

	/* Return a collection class definition */
	return Backbone.Collection.extend({
		model: Shred,

        queryParams : {},

		initialize : function(opts) {
			opts = opts || {};
			if ( opts.query ) { this.setQuery(opts.query); }
		},

        // TODO: this part can be reused
        url : function () {
            var url =  this.model.prototype.urlRoot + 'query', qs = '';

            for(var key in this.queryParams) {
                var value = this.queryParams[key];
                qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
            }
            if (qs.length > 0){
                qs = qs.substring(0, qs.length - 1); //chop off last "&"
                url = url + '?' + qs;
            }
            return url;
        },

		setQuery : function (query) {
			for ( var key in query ) {
				if ( query[key] === '*' ) {
					delete this.queryParams[key];
				} else {
					this.queryParams[key] = query[key];
				}
            }
        }
	});
});
