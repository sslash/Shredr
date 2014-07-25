/* global require */
define([
    'backbone'
],function ( Backbone){
    'use strict';

    var Comment = Backbone.Model.extend({
        url : function () {
            return '/api/' + this.get('type') + '/' + this.get('_id') + '/comment';
        },

        parse : function (attrs) {
            if (attrs.comments) {
                return attrs.comments[attrs.comments.length-1];
            } else {
                return attrs;
            }
        }
    });
    return Comment;
});
