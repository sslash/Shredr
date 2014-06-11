/* globals $ */
define([
'backbone',
'hbs!tmpl/workspace/resourcesScalesItemView'
],
function( Backbone, Tpl ) {
    'use strict';

    var ScaleThumb = Backbone.Marionette.ItemView.extend({
        template : Tpl,
        className : 'row clearfix paxl brd-light-bottom li-hover',
        triggers : { 'click' : 'clicked'}
    });

    /* Return a Layout class definition */
    return Backbone.Marionette.CollectionView.extend({
        itemView : ScaleThumb,
        //itemViewEventPrefix: "scale:view",
        initialize : function () {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this, 'itemview:clicked', this.itemClicked);
        },

        itemClicked : function (itemView) {
            this.trigger('item:clicked', itemView.model);
        }
    });
});
