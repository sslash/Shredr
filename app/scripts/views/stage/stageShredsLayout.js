/* global define */
define([
    'backbone',
    'views/stage/feedView',
    'hbs!tmpl/stage/stageShredsLayout'
],
function (
    Backbone,
    FeedView,
    Tpl
){
'use strict';
var StageShredsLayout = Backbone.Marionette.Layout.extend({
    template : Tpl,

    events : {},

    regions : {
        feed : '[data-reg="feed"]'
    },

    initialize : function (options) {
        this.renderFeedRegion();
        this.listenTo(this.collection, 'sync', this.render);
    },

    serializeData : function () {
        var shreds = this.collection.toJSON();
        return {
            leftShreds : shreds.slice(0,14),
            rightShredsTop : shreds.slice(14,22),
            rightShredsBottom : shreds.slice(22,28)
        };
    },

    onRender : function () {

        // need to reset the region because we F*=)#/´d the DOM
        this.feed.reset();
        this.renderFeedRegion();
    },

    renderFeedRegion : function () {
        this.feed.show(new FeedView());
    },
});

return StageShredsLayout;
});
