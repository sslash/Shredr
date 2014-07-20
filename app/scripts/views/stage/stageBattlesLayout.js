/* global define */
define([
    'backbone',
    'hbs!tmpl/stage/stageBattlesLayout'
],
function (
    Backbone,
    tpl
){
'use strict';
var StageBattlesLayout = Backbone.Marionette.Layout.extend({
    template : tpl,

    initialize : function () {
        this.listenTo(this.collection, 'sync', this.render);
    },

    events : {
        'click [data-evt="battle-clk"]' : '__battleClicked'
    },

    __battleClicked : function (e) {
        var id = $(e.currentTarget).attr('data-mod');
        Shredr.navigate('/battle/' + id, {trigger : true});
    },

    serializeData : function () {
        return {
            things : this.collection.toJSON()
        };
    },

    onRender : function () {}
});

return StageBattlesLayout;
});
