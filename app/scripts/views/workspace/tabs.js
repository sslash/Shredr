define([
	'backbone',
	'hbs!tmpl/workspace/scale_tabs_tmpl',
	'hbs!tmpl/workspace/create_shred_tabs_tmpl',
	'models/tabGenerator',
],
function( Backbone, ScaleTmpl, NormalTmpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({
		className : 'sr-region-inner',

    	template: ScaleTmpl,

		initialize : function (options) {
			options = options || {};
			if ( options.template ) {
				this.otherTmpl = NormalTmpl;
			}
		},

    	/* ui selector cache */
    	ui: {},

		events : {
			'click .arrow_box' : '__arrowClicked'
		},

		getTemplate : function () {
			return this.otherTmpl || this.template;
		},

		__arrowClicked : function() {
			this.trigger('arrow:event:click');
		},

		/* on render callback */
		onRender: function() {
			this.tabsGen = this.$('.tabsArea .tabs-row:first-child')
			.tabGenerator({
				notes : this.$('[data-model="note"]'),
				input : this.$('#tabs-cursor'),
				drawMultiRow : 20, // 25 px margin
				paintedRows : 4,
				appendRowFn : this.appendRowFn.bind(this)
			});
		},

		appendRowFn : function () {
			var html = [
				'<div class="tabs-row">',
				'<img src="img/tabs.png" class="tabs-img" style="width:100%;">',
				'</div>'].join('');

			this.$('.tabsArea .rows').append(html);
		},

		playTabs : function () {
			this.tabsGen.playTabs();
		},

		getTabs : function () {
			return this.tabsGen.getTabs();
		}
	});

});
