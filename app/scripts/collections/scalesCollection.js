define([
    'backbone',
    'models/scale'
],
function( Backbone, Scale ) {
    'use strict';

    /* Return a collection class definition */
    return Backbone.Collection.extend({
        url : 'api/scales',
        model: Scale
    });
});
