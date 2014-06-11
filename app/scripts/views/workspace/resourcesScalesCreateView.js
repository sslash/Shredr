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

        events : {
            'click [data-evt="save"]' : '__saveClicked'
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
        },

        __saveClicked : function () {
            this.model.set({
                title : this.$('#scale-title').val(),
                description : this.$('#scale-desc').val(),
                tabs : this.tabsComponent.getTabs(),
                tabsKey : this.$('#tabs-key').val()
            });

            Shredr.baseController.exec(this.model, 'save',
                {success : this.onScaleCreated.bind(this)});
        },

        onScaleCreated : function (scaleModel) {

            // Set the user model here since its not been
            // populated on the server when saved. A bit lol,
            // but still a fair solution. 
            scaleModel.set('user', Shredr.user.toJSON());
            this.trigger('scale:created', scaleModel);
        }
    });
});
