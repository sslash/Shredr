/* global define */
define([
    'backbone',
    'components/searchComponent',
    'hbs!tmpl/stage/stageShredsKickerView'
],
function (
    Backbone,
    SearchComponent,
    Tpl
){
'use strict';
var StageShredsKickerView = Backbone.Marionette.ItemView.extend({
    template : Tpl,

    ui : {
        more : '[data-reg="more"]',
        search : '[data-reg="search"]',
        tags : '[data-reg="tags"]'
    },

    events : {
        'click [data-mod="filters"] span' : '__filterClicked',
        'click [data-evt="more"]'         : '__moreClicked',
        'keypress [data-evt="tags"]'      : '__tagsKeyPressed',
        'click [data-evt="tag"]'          : '__tagClicked'
    },

    initialize : function () {
        this.tags = [];
    },

    onRender : function () {
        this.searchCmp = new SearchComponent({
            region : new Backbone.Marionette.Region({el : this.ui.search}),
            collection : this.collection
        }).show();
    },

    __filterClicked : function (e) {
        var $curr = $(e.currentTarget);
        this.$('.active').removeClass('active');
        $curr.addClass('active');
        var val = $curr.attr('data-model');

        this.collection.setQuery({type : val});
        Shredr.baseController.exec(this.collection, 'fetch');
    },

    __tagsKeyPressed : function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.handleTags(e.currentTarget.value);
            $(e.currentTarget).val('');
        }
    },

    handleTags : function (value) {
        this.tags.push(value);
        this.collection.setQuery({tags : this.tags});
        Shredr.baseController.exec(this.collection, 'fetch');
        var html = '<span class="small tags point" data-evt="tag">' + value + '</span>';
        if ( this.ui.tags.text() === 'Add Tags') {
            this.ui.tags.text('');
        }

        this.ui.tags.append(html);
    },

    __tagClicked : function (e) {
        var $ct = $(e.currentTarget);
        var val = $ct.text();
        this.tags = this.tags.filter(function (t) {
            return t !== val;
        });
        this.collection.setQuery({tags : this.tags});
        Shredr.baseController.exec(this.collection, 'fetch');
        $ct.remove();
    },

    __moreClicked : function (e) {
        var $ct = $(e.currentTarget);
        if ($ct.attr('data-mod') === 'up') { this.slideDown($ct); }
        else { this.slideUp($ct); }
    },

    slideDown : function ($ct) {
        this.$('[data-reg="more"]').slideDown();
        this.slide($ct, 'down', 'up');
    },

    slideUp : function ($ct) {
        this.$('[data-reg="more"]').slideUp();
        this.slide($ct, 'up', 'down');
    },

    slide : function ($ct, removeClass, addClass) {
        $ct.removeClass('ion-ios7-arrow-' + removeClass)
        .addClass('ion-ios7-arrow-' + addClass).attr('data-mod', removeClass);
    }
});

return StageShredsKickerView;
});
