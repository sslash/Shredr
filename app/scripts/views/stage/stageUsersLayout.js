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
