/* global define */
define([
    'backbone',
    'models/user',
    'collections/searchCollection'
],
function( Backbone, User, searchCollection ) {
    'use strict';

    var usersCollection = Backbone.Collection.extend({
        model: User
    });

    _.extend(usersCollection.prototype, searchCollection);

    return usersCollection;
});
