/* globals $ */
define([
'backbone',
'models/Scale',
'components/tabsComponent',
'views/workspace/resourcesScalesListView',
'views/workspace/resourcesScalesCreateView',
'hbs!tmpl/workspace/resourcesScalesLayout'
],
function(
    Backbone,
    Scale,
    TabsComponent,
    ResourcesScalesListView,
    ResourcesScalesCreateView,
    Tpl
) {
    'use strict';

    /* Return a Layout class definition */
    return Backbone.Marionette.Layout.extend({
        template : Tpl,
        regions : {list : '[data-reg="list"]'},
        ui : {
            create : '[data-reg="create"]',
            preview : '[data-reg="preview"]'
        },

        onRender : function () {
            this.model = this.collection.at(0);
            var view = new ResourcesScalesListView({collection : this.collection});
            this.list.show(view);
            this.renderTabs();

            this.listenTo(Shredr.vent, 'resources:addBtn:clicked', this.createClicked);
            this.listenTo(view, 'item:clicked', this.itemClicked);
        },

        renderTabs : function () {
            this.tabsComponent = new TabsComponent({
                model : this.model,
                disabled : true,
                region : new Backbone.Marionette.Region({el : this.$('[data-reg="tabs"]')})
            }).show();
        },

        createClicked : function () {
            this.ui.preview.fadeOut('fast');
            var view = new ResourcesScalesCreateView();
            this.ui.create.html(view.render().el).fadeIn();

        },

        itemClicked : function (scaleModel) {
        }
    });
});
