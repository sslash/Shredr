/* globals $ */
define([
'backbone',
'models/scale',
'components/tabsComponent',
'views/workspace/resourcesScalesListView',
'views/workspace/resourcesScalesCreateView',
'hbs!tmpl/workspace/resourcesScalesLayout',
'hbs!tmpl/workspace/resourcesScalesPreview'
],
function(
    Backbone,
    Scale,
    TabsComponent,
    ResourcesScalesListView,
    ResourcesScalesCreateView,
    tpl,
    prevTpl
) {
    'use strict';

    /* Return a Layout class definition */
    return Backbone.Marionette.Layout.extend({
        template : tpl,
        regions : {list : '[data-reg="list"]'},
        ui : {
            create : '[data-reg="create"]',
            preview : '[data-reg="preview"]',
            tabs : '[data-reg="tabs"]'
        },

        onRender : function () {
            this.listenTo(this.collection, 'reset', this.showPreview);
            if ( this.collection.models.length > 0 ) { this.showPreview(); }
            var view = new ResourcesScalesListView({collection : this.collection});
            this.list.show(view);
            this.listenTo(Shredr.vent, 'resources:addBtn:clicked', this.createClicked);
            this.listenTo(view, 'item:clicked', this.itemClicked);
        },

        showPreview : function () {console.log('sapda')
            this.model = this.collection.at(0);
            this.renderPreview();
            if ( this.model ) {
                this.renderTabs();
            }
        },

        hidePreview : function () {
            this.ui.preview.fadeOut('fast');
            this.ui.tabs.hide();
            this.tabsComponent.close();
        },

        renderPreview : function () {
            if ( this.model ) {
                this.ui.preview.html(prevTpl(this.model.toJSON()));
                this.ui.preview.fadeIn();
            }
        },

        // Called everytime a new scale is chosen.
        // Might be wise to check if there are any memory leaks with
        // setting the this.tabsComponent pointer over again
        renderTabs : function () {
            this.ui.create.hide();
            this.tabsComponent = new TabsComponent({
                model : this.model,
                disabled : true,
                region : new Backbone.Marionette.Region({el : this.$('[data-reg="tabs"]')})
            }).show();
            this.ui.tabs.show();
        },

        createClicked : function () {
            this.hidePreview();
            var view = new ResourcesScalesCreateView();
            this.ui.create.html(view.render().el).fadeIn();
            this.listenTo(view, 'scale:created', this.scaleCreateSuccess);
        },

        scaleCreateSuccess : function (scaleModel) {
            this.model = scaleModel;
            this.collection.add(scaleModel);
            this.showPreview();
        },

        itemClicked : function (scaleModel) {
            this.model = scaleModel;
            this.showPreview();
        }
    });
});
