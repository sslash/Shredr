/* globals $ */
define([
'backbone',
'models/Scale',
'components/tabsComponent',
'hbs!tmpl/workspace/resourcesScalesCreateView'
],
function(
    Backbone,
    Scale,
    TabsComponent,
    Tpl
) {
    'use strict';

    /* Return a Layout class definition */
    return Backbone.Marionette.ItemView.extend({
        template : Tpl,
        initialize : function () {
            this.model = new Scale();
        },
        onRender : function () {
            this.renderTabs();
        },

        serializeData : function () { return Shredr.user.toJSON(); },

        renderTabs : function () {
            this.tabsComponent = new TabsComponent({
                model : this.model,
                region : new Backbone.Marionette.Region({el : this.$('[data-reg="tabs"]')})
            }).show();
        }
    });
});
