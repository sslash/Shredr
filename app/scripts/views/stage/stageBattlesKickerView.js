/* global define */
define([
    'backbone',
    'components/searchComponent',
    'hbs!tmpl/stage/stageBattlesKickerView'
],
function (
    Backbone,
    SearchComponent,
    tpl
){
'use strict';
var StageBattlesKickerView = Backbone.Marionette.ItemView.extend({
    template : tpl,

    ui : {search : '[data-reg="search"]' },

    onRender : function () {
        this.searchCmp = new SearchComponent({
            region : new Backbone.Marionette.Region({el : this.ui.search}),
            collection : this.collection
        }).show();
    }
});

return StageBattlesKickerView;
});
