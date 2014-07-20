define([
'components/component',
'hbs!tmpl/components/searchView',
],
function( Component, tpl ) {
    'use strict';

    var SearchView = Backbone.Marionette.ItemView.extend({
        template : tpl,
        className : 'le-wrap',
        events: {
            'keypress input[type="search"]'  : '__searchKeyPressed'
        },

        __searchKeyPressed : function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.handleSearch(e.currentTarget.value);
            }
        },

        handleSearch : function (val) {
            this.collection.setQuery({q: val});
            Shredr.baseController.exec(this.collection,
            'fetch', {
                type : 'collection',
                success : this.onSearchSuccess,
                event : 'shreds:search'
            });
        },

        onSearchSuccess : function (res) {
            console.log('hei : ' + res.models.length);
        }
    });

    return Component.extend({

        initialize: function(options) {
            Component.prototype.initialize.call(this, options);
            this.view = new SearchView({collection : options.collection})
        }
    });
});
