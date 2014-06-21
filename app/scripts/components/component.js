define([
    'backbone'
    ],
    function( Backbone ) {
        'use strict';
        var Component = Backbone.Marionette.Controller.extend({
            initialize : function (opts) {
                if ( opts.region ) {
                    if ( typeof opts.region === 'string' ) {
                        this.region = new Backbone.Marionette.Region({el : $(opts.region)})
                    } else {
                        this.region = opts.region;
                    }
                }

                if ( opts.model ) {
                    this.model = opts.model;
                }
            },

            show : function () {
                this.region.show(this.view);
                return this;
            },

            close : function () {
                this.region.close();
            }
        })
        return Component;
    });
