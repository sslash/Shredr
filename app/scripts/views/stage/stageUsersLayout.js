/* global define */
define([
    'backbone',
    'components/mapComponent',
    'hbs!tmpl/stage/stageUsersLayout'
],
function (
    Backbone,
    MapComponent,
    Tpl
){
'use strict';
var StageUsersLayout = Backbone.Marionette.Layout.extend({
    template : Tpl,

    initialize : function () {
        this.listenTo(this.collection, 'sync', this.render);
    },

    serializeData : function () {
        var users = this.collection.toJSON();
        return {
            leftUsers : users.slice(0, 15),
            rightUsers : users.slice(15, 30)
        };
    },

    onRender : function () {
        this.playerComponent = new MapComponent({
            region : new Backbone.Marionette.Region({
                el : this.$('[data-reg="map"]'),
            })
        }).show();
    }
});

return StageUsersLayout;
});
