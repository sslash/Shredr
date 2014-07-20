define([
    'backbone',
    'components/component',
    'hbs!tmpl/components/mapComponent',

    ],
    function( Backbone, Component, Tpl ) {
        'use strict';

        var View = Backbone.Marionette.ItemView.extend({
            template : Tpl,

            onShow : function () {
            //    this.renderGoogleMaps();
            },

            renderGoogleMaps : function () {
                this.initBootstrapFn();
                // THIS GIVES ME AN ERROR MESSAGE
                // var script = document.createElement('script');
                // script.type = 'text/javascript';
                // script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCrYjNmQVLh8_B9pleB_atter-9TvOq9UE&sensor=false&v=3.16&' +
                // 'callback=initialize';
                // document.body.appendChild(script);
            },

            initBootstrapFn : function () {
                window.initialize = function () {
                    var mapOptions = {
                        zoom: 8,
                        center: new google.maps.LatLng(-34.397, 150.644)
                    };
                    var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);
                }
                window.initialize();
            }
        });


        return Component.extend({

            initialize: function(options) {
                Component.prototype.initialize.call(this, options);
                this.view = new View();
            }
        });
    });
