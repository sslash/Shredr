/* global define */
define([
	'backbone',
	'models/shred',
	'collections/searchCollection'
],
function( Backbone, Shred, searchCollection ) {
    'use strict';

	/* Return a collection class definition */
	var shredsCollection = Backbone.Collection.extend({
		model: Shred,

		initialize : function(opts) {
			opts = opts || {};
			if ( opts.query ) { this.setQuery(opts.query); }
		}
	});

	_.extend(shredsCollection.prototype, searchCollection);

	return shredsCollection;
});
