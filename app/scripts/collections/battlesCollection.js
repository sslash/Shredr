define([
	'backbone',
	'models/battle'
],
function( Backbone, Battle ) {
    'use strict';
    
	return Backbone.Collection.extend({
		url : 'api/battles',
		model: Battle
	});
});
