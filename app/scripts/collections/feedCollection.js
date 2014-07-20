/* global define */
define([
    'backbone',
    'models/feed'
],
function( Backbone, Feed ) {
    'use strict';

    return Backbone.Collection.extend({
        model: Feed
    });
});
