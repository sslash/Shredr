define([
    'backbone',
    'models/jamtrack'
],
function( Backbone, Jamtrack ) {
    'use strict';

    /* Return a collection class definition */
    return Backbone.Collection.extend({
        url : 'api/jamtracks',
        model: Jamtrack,

        toJSON : function () {
            return this.models.map(function(jamtrack){
                return jamtrack.toJSON();
            });
        }
    });
});
