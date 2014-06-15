// Details view : https://dribbble.com/shots/1341149-Becoming-a-better-designer/attachments/189989
// jamtracks to the left: https://dribbble.com/shots/1360933-Community-re-design?list=searches&tag=community&offset=27
// scale, theory, chords in top menu: https://dribbble.com/shots/1347986-Re-design-project?list=searches&tag=community&offset=23
/* globals $ */

// https://dribbble.com/shots/1341149-Becoming-a-better-designer/attachments/189989
define([
	'backbone',
	'collections/scalesCollection',
	'views/workspace/resourcesScalesLayout',
	'views/workspace/resourcesTheoryLayout',
	// 'views/workspace/comingSoon',
	'views/workspace/resourcesJamtrackView',
	'hbs!tmpl/workspace/resourcesLayout'
],
function(
	Backbone,
	ScalesCollection,
	ResourcesScalesLayout,
	ResourcesTheoryLayout,
	ResourcesJamtrackView,
	Tpl
) {
    'use strict';

	return Backbone.Marionette.Layout.extend({
		template : Tpl,
		className : 'no-top-marg',

		initialize : function () {
			Shredr.vent.trigger('workspace:resources:render');
			this.listenTo(Shredr.vent, 'resources:scales:clicked', this.scalesClicked);
			this.listenTo(Shredr.vent, 'resources:chords:clicked', this.chordsClicked);
			this.listenTo(Shredr.vent, 'resources:theory:clicked', this.chordsClicked);
			this.listenTo(Shredr.vent, 'resources:back:clicked', this.backClicked);
		},

		ui : {
			catContent  : '[data-reg="catContent"]',
			homeContent : '[data-reg="homeContent"]',
			content	: '[data-reg="content"]',
			search	: '[data-reg="search"]'
		},

		regions : { jamtrack : '[data-reg="jamtrack"]' },

		onRender : function () {
			this.jamtrack.show(new ResourcesJamtrackView());
		},

		scalesClicked : function () {
			var coll = new ScalesCollection();
			Shredr.baseController.exec(coll, 'fetch', {reset : true});
			var view = new ResourcesScalesLayout({collection : coll});
			this.renderCatView(view);
		},

		backClicked : function () {
			this.render();
		},

		chordsClicked : function () {
			var coll = new Backbone.Collection();
			var view = new ResourcesTheoryLayout({collection : coll});
			this.renderCatView(view);

		},

		renderCatView : function (view) {
			if ( this.catView ) { this.catView.close(); }
			this.catView = view;
			this.ui.homeContent.fadeOut('fast', function () {
				this.ui.catContent.html(view.render().el);
				this.ui.catContent.fadeIn('fast', function () {
					this.ui.content.animate({top : '-195px'});
					this.ui.search.animate({top : '-80px'});
				}.bind(this));
			}.bind(this));
		},

		createSubview : function (category) {
			switch (category) {
				case 'scales':
					this.renderSubView(ScalesTheoryView);
					break;
				default:
					this.renderSubView(ComingSoonView);
					break;
			}
		},

		renderSubView : function (View) {
			this.ui.theoryContent.fadeOut('fast', function () {
				this.theoryContent.show(new View());
					this.ui.theoryContent.fadeIn('fast');
			}.bind(this));
		},

		// EVENTS

		__jamtrackClicked : function () {
			this.renderSubView(BacktrackView);
		},

		__backClicked : function () {
			Backbone.history.history.back();
		},

		__categoryClicked : function (e) {
			e.preventDefault();
			e.stopPropagation();
			this.createSubview($(e.currentTarget).attr('data-model'));
		}
    });
});
