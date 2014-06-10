define([
	'backbone',
	'hbs!tmpl/workspace/preview_tmpl'
],
function( Backbone, PreviewTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({
		className : 'upload-wrap',


    	template: PreviewTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
