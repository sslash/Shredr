/* global define */
define([
    'backbone',
    'components/searchComponent',
    'hbs!tmpl/stage/stageUsersKickerView'
],
function (
    Backbone,
    SearchComponent,
    Tpl
){
'use strict';
var StageShredsKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,

    ui : {search : '[data-reg="search"]' },

    onRender : function () {
        this.searchCmp = new SearchComponent({
            region : new Backbone.Marionette.Region({el : this.ui.search}),
            collection : this.collection
        }).show();
    }
});

return StageShredsKickerView;
});
