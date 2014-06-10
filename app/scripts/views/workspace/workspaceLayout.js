/* global Shredr */
define([
	'backbone',
	'models/shred',

	// Views
	'views/workspace/uploadShredView',
	'views/workspace/resourcesLayout',
	'hbs!tmpl/workspace/workspaceLayout'
],
function( Backbone, Shred, UploadView, ResourcesLayout, Tpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({
		template: Tpl,


		initialize: function() {
			// this.model = new Shred();
			// this.vent = new Backbone.Wreqr.EventAggregator();
			// this.listenTo(this.vent, 'workspace:model:uploaded', this.shredUploaded);
			// this.listenTo(this.vent, 'tabsView:click:open', this.tabsClicked);
			// this.listenTo(this.vent, 'tabsView:click:close', this.tabsCloseClicked);
		},

    	regions: { resources : '[data-reg="resources"]'},

    	ui: { mainContent : '[data-reg="mainContent"]' },

		events: {
			'click #resources' 	: '__resourcesClicked',
			'click #upload'		: '__uploadClicked'
		},

		onRender : function () {},

		// showTransover : function (cb) {
		// 	this.ui.banners.fadeOut('fast', cb);
		// },

		__uploadClicked : function() {
			var uploadView = new UploadView({model : new Shred(), classes : 'modal-huge modal-tall form-dark'});
			Shredr.baseController.showModal(uploadView);
		},
		//
		// tabsCloseClicked : function () {
		// 	this.tabs.close();
		// },

		__resourcesClicked : function() {
			var resourcesLayout = new ResourcesLayout();
			this.$('[data-reg="mainContent"]').fadeOut('fast', function(){
				this.resources.show(resourcesLayout);
			}.bind(this));
			// this.showTransover( function () {
			// 		Shredr.router.navigate("/workspace/theorySection", {trigger: true});
			// });
		},

		// arrowClicked : function ( container, opts) {
		// 	container.animate(opts, 'slow');
		// 	this.showButtons();
		// },
		//
		// uploadModalClosed : function() {
		// 	this.ui.upload.fadeOut();
		// 	this.showButtons();
		// },
		//
		// showButtons : function () {
		// 	this.ui.banners.fadeIn();
		// },

		// shredUploaded : function() {
		// 	this.uploadModalClosed();
		// 	this.previewView = new PreviewView();
		// 	this.ui.uploadBtn.hide();
		// 	this.preview.show(this.previewView);
		// }
	});

});
