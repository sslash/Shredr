/* global define */
define([
    'backbone',
    'models/comment'
],
function( Backbone, Comment ) {
    'use strict';

    return Backbone.Collection.extend({
        model: Comment
    });
});
