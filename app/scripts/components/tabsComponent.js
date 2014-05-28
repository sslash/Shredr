define([
	'backbone',
    'components/component',
    'hbs!tmpl/components/tabsView',
	'models/tabGenerator',
],
function( Backbone, Component, Tmpl ) {
    'use strict';

    var TabsView = Backbone.Marionette.Layout.extend({
        className : 'sr-region-inner',

        template: Tmpl,

        events : {
            'click .arrow_box' : '__arrowClicked'
        },

        /* on render callback */
        onShow: function() {
            this.tabsGen = this.$('.tabsArea .tabs-row:first-child')
            .tabGenerator({
				tabs : this.model.get('tabs').tabs,
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
                '<img src="/img/tabs.png" class="tabs-img" style="width:100%;">',
                '</div>'].join('');

            this.$('.tabsArea .rows').append(html);
        },

        playTabs : function () {
            this.tabsGen.playTabs();
        },

        getTabs : function () {
            return this.tabsGen.getTabs();
        },

        __arrowClicked : function() {
            this.trigger('arrow:event:click');
        }

    });

	/* Return a ItemView class definition */
	return Component.extend({
        initialize : function (opts) {
            Component.prototype.initialize.call(this, opts);
            this.view = new TabsView({ model : this.model });
        }
	});

});
