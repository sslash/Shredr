/* global Shredr */
define([
    'backbone',
    'components/tabsComponent',
    'hbs!tmpl/workspace/createShredsTabs',
    'views/workspace/tabs'
    ],
    function( Backbone, TabsComponent, TabsTmpl, TabsEditor ) {
        'use strict';

        /* Return a ItemView class definition */
        return Backbone.Marionette.ItemView.extend({
            className : 'sr-background over-fs-2',

            template: TabsTmpl,

            /* ui selector cache */
            ui: {
                tabs : '[data-region="leTabs"]'
            },

            events : {
                'click [data-evt="play"]' : '__playTabsClicked',
                'click [data-event="keyboard-clicked"]' : '__keyboardClicked',
                'click [data-event="save-tabs-btn"]' : '__saveTabsClicked'
            },

            onShow : function () {
                this.renderTabs();
            },

            serializeData : function () {
                return {
                    m : this.model.toJSON(),
                    user : Shredr.user.toJSON()
                }
            },

            renderTabs : function () {
                this.tabsComponent = new TabsComponent({
                    model : this.model,
                    region : new Backbone.Marionette.Region({el : this.$('[data-reg="tabs"]')}),
                    rows : 2
                }).show();
            },

            renderKeyboard : function () {
                this.$("use").mousedown(this.startNote);
                this.$("use").mouseup(this.stopNote);
                this.$("#playAll").click(this.playAll);
            },

            __playTabsClicked : function () {
                this.tabsComponent.playTabs();
            },

            __keyboardClicked : function () {
                if(this.keyboardVis) {
                    this.$('.keyboard').animate({'left' : '-2000px'}, 'fast');
                    this.keyboardVis = false;
                } else {
                    this.$('.keyboard').animate({'left' : '56px'}, 'fast');
                    this.keyboardVis = true;
                }
            },

            __saveTabsClicked : function () {
                var tabs = this.tabsComponent.getTabs();
                this.model.set({tabs : tabs});
                this.trigger('tabs:save:clicked');
            }
        });

    });
