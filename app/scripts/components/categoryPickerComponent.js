/*
<!-- {{#each things}}
    <a href="" class="white mhs">{{this}}</a>
{{/each}} -->

*/
define([
    'components/component',
    'hbs!tmpl/components/categoryPickerView',
    ],
    function( Component,tpl ) {
        'use strict';

        var ItemView = Backbone.Marionette.ItemView.extend({
            template : tpl,
            className : 'fat mvl',
            initialize : function (opts) {this.categories = opts.categories; },
            serializeData : function () { return {things : this.categories}; },
            onRender : function () {
                this.$('a:first-child').addClass('active');
            },

            events : { 'click a' : '__aClicked' },

            getCurrentType : function () {
                return this.$('.active').text();
            },

            __aClicked : function (e) {
                e.preventDefault();
                var $ct = $(e.currentTarget);
                this.$('.active').removeClass('active');
                $ct.addClass('active');
                this.trigger('category:clicked', $ct.text());
            }
        });

        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);
                this.view = new ItemView({categories : options.categories});
                this.listenTo(this.view, 'category:clicked', function (cat) {
                    this.trigger('category:clicked', cat);
                }.bind(this));
            },

            getCurrentType : function () {
                return this.view.getCurrentType();
            }
        });
    });
