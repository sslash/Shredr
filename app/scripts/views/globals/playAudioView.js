define([
    'backbone',
    'hbs!tmpl/globals/playAudioView'
],
function (
    Backbone,
    tpl
){
'use strict';
var NavRegionView = Backbone.Marionette.ItemView.extend({
    template : tpl,
    className : 'jamtrack-player pull-right',

    events : {
        'click [data-evt="stop"]' : '__stopClicked'
    },

    __stopClicked : function () {
        this.$audio[0].pause();
        this.$audio[0].currentTime = 0;
        this.$el.removeClass('pull-right-after');
    },

    playJamtrack : function (jamtrack) {
        this.$audio = this.$('audio');
        this.$audio.attr('src', '/audio/' + jamtrack.get('fileId'));
        this.showAnimation(jamtrack.get('title'));
        this.$audio[0].play();
    },

    showAnimation : function (title) {
        this.$('[data-reg="title"]').text(title);
        this.$el.addClass('pull-right-after');

    }
});

return NavRegionView;
});
