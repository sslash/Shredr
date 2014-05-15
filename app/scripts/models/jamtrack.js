define([
    'backbone',
    'models/user'
],
function( Backbone, User ) {
    'use strict';

    /* Return a model class definition */
    return Backbone.Model.extend({
        urlRoot : 'api/jamtracks/',
        initialize: function() {
            if ( this.get('_id') ) {
                this.id = this.get('_id');
            }

            if (this.get('createdAt')) {
                this.setDateString(this.get('createdAt'));
            }
            if ( this.get('user') ) {
                this.set('user', new User(this.get('user')));
            }

            this.setFilePath(this.get('fileId'));
        },

        setFilePath : function (file) {
            if (!file) { return; }
            this.set('fullFilePath', 'audio/' + file);
        },

        defaults: {
            title : '',
            description : ''
        },

        toJSON : function () {
            var jamtrack = Backbone.Model.prototype.toJSON.call(this);
            if (jamtrack.user && jamtrack.user.toJSON) {
                jamtrack.user = jamtrack.user.toJSON();
            }
            return jamtrack;
        },

        parse : function (attrs) {

            if (attrs.createdAt) { this.setDateString(attrs.createdAt); }
            if ( attrs._id ) {
                this.id = attrs._id;
            }

            if ( attrs.user ) {
                attrs.user = new User(attrs.user);
            }

            this.setFilePath(attrs.fileId);

            return attrs;
        },

        getUploadUrl : function () {
            return this.url() + '/upload';
        }
    });
});
