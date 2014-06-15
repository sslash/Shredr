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

    playJamtrack : function (jamtrack) {
        var $audio = this.$('audio');
        $audio.attr('src', '/audio/' + jamtrack.get('fileId'));
        this.showAnimation(jamtrack.get('title'));
        $audio[0].play();
    },

    showAnimation : function (title) {
        this.$('[data-reg="title"]').text(title);
        this.$el.addClass('pull-right-after');

    }
});

return NavRegionView;
});
