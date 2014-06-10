/**
* On Shredr, there exists two types of tags
* (plus jamtracks, which sometimesacts as tags):
*
* Shred-tags: scales, chords, theory, techniques, genre etc
* Gear-tags: Gibson Les Paul, Marshall JCM2000 etc
*
* When shreds, scales, battles, theory articles etc are saved,
* possible new tags are also saved.
*
* These are fetched when autocomplete tasks are given
*
* TODO: figure out if these tags should be bootstrapped..
*/

define([
    'backbone'
    ],
    function( Backbone ) {
        'use strict';

        /* Return a model class definition */
        return Backbone.Model.extend({
            urlRoot : 'api/tags/',
        defaults : {
            shredTags : [],
            gearTags : [],
            jamtrackTags : []
        },

        initialize: function (options) {
            if ( this.get('_id') ) {
                this.id = this.get('_id');
            }

            this.type = options.type;

            // url end-point depends on type og tags
            if ( this.type === 'jamtracks') {
                this.urlRoot = 'api/jamtracks';
            } else {
                this.urlRoot += options.type;
            }
        },

        getTagsByType : function () {
            if ( this.type === 'shreds' ) {
                return this.get('shredTags');
            } else if ( this.type === 'gear' ) {
                return this.get('gearTags');
            } else {
                return this.get('jamtrackTags');
            }
        },

        parse : function (attrs) {

            if ( this.type === 'jamtracks' ) {
                attrs.jamtrackTags = attrs.map(function(jamtrack) {
                    return jamtrack.title;
                });
            }

            return attrs;
        }
    });
});
