define([
	'backbone',
	'models/battle',
	'collections/searchCollection'
],
function( Backbone, Battle, searchCollection ) {
    'use strict';

	var coll = Backbone.Collection.extend({
		url : 'api/battles',
		model: Battle
	});

	_.extend(coll.prototype, searchCollection);

	return coll;

});
