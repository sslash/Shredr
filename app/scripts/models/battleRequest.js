define([
    'backbone',
    'models/user',
    'models/jamtrack',
],
function( Backbone, User, Jamtrack ) {
    'use strict';
    return Backbone.Model.extend({
        urlRoot : '/api/battleRequest',

        defaults: {
            battler : {},
            battlee : {}
        },

        parse : function (attrs) {
            if ( attrs._id ) {
                this.id = attrs._id;
            }

            if ( attrs.battler ) {
                attrs.battler = new User(attrs.battler, {parse:true});
            }

            if ( attrs.battlee ) {
                attrs.battlee = new User(attrs.battlee, {parse:true});
            }

            if ( attrs.jamtrackId) {
                attrs.jamtrack = new Jamtrack(attrs.jamtrackId);
                attrs.fileId = attrs.jamtrack.get('fileId');
            }

            return attrs;
        },

        toJSON : function () {
            var json = Backbone.Model.prototype.toJSON.call(this);
            if ( this.get('battler') && this.get('battler').toJSON ) {
                json.battler = this.get('battler').toJSON();
            }

            if ( this.get('battlee') && this.get('battlee').toJSON ) {
                json.battlee = this.get('battlee').toJSON();
            }

            if ( this.get('jamtrack') && this.get('jamtrack').toJSON ) {
                json.jamtrack = this.get('jamtrack').toJSON();
            }
            return json;
        },

        getUploadUrl : function () {
            if ( !this.id ) {
                throw Error('Battle Request object does not have an ID');
            }

            return this.url() + '/' + this.get('mode') + '/uploadFile';
        },

        getUploadAdvancedFinishedUrl : function () {
            return this.url() + '/' + this.get('mode') + '/uploadVideoFile';
        },

        acceptRequest : function () {
            var that = this;
            $.post(this.url() + '/accept')
            .done ( function (battle) {
                that.trigger('battleRequest:accept:success', battle);
            });
        }
    });
});
