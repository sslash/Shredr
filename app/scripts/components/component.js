define([
    'backbone'
    ],
    function( Backbone ) {
        'use strict';
        var Component = Backbone.Marionette.Controller.extend({
            initialize : function (opts) {
                if ( opts.region ) {
                    this.region = opts.region;
                }

                if ( opts.model ) {
                    this.model = opts.model;
                }
            },

            show : function () {
                this.region.show(this.view);
                return this;
            }
        })
        return Component;
    });
