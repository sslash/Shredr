/* Stopped working on this atm (24.mai 2014)
*  What lacks is:
*
*    Verifying the correct user is participating (backend)
*    Finishing a battle
*    Playback must at least have stop, and preferably ability to skip rounds
*    Navigation on the right
*/


/* global define */
define([
    'backbone',
    'components/battlePlayerComponent',
    'components/commentComponent',
    'collections/commentsCollection',
    'hbs!tmpl/battle/battleDetailLayout'
],
function (
    Backbone,
    VPComponent,
    CommentComponent,
    CommentCollection,
    Tpl
){
'use strict';

var BattleDetailLayout = Backbone.Marionette.Layout.extend({
    template : Tpl,

    events : {
        'click [data-evt="rel-bat"]' : '__relatedBattleClicked',
        'click [data-evt="play"]'    : '__playClicked',
        'click [data-evt="vote"]'    : '__voteClicked'
    },

    initialize : function (opts) {
        if ( opts.serverRender ) {
            this.onRender();
        }
        this.listenTo(this.model, 'change:votes', this.renderVotes);
        this.listenTo(this.model, 'change:rounds', this.render);
    },

    serializeData : function () {
        var model = this.model.toJSON();
        return {
            m : model,
            roundNo : model.rounds.length,
            things : this.collection.toJSON(),
            onlyOneVid : model.rounds[0].length === 1
        };
    },

    onRender : function () {
        this.showBattles();
        this.renderVotes();
        this.renderComments();
    },

    showBattles : function () {
        this.$battlerVids = this.$('[data-model="battlerVid"]');
        this.$battlerVids.first().show();

        this.$battleeVids = this.$('[data-model="battleeVid"]');
        this.$battleeVids.first().show();
        this.ui = this.ui || {};
        this.ui.duration = this.$('[data-model="dur"]');
    },

    renderVotes : function () {
        var v = this.model.getVotes();
        this.$('[data-model="battlers-vts"]').text(v.battlers + ' votes');
        this.$('[data-model="battlees-vts"]').text(v.battlees + ' votes');

        // draw bar
        var width = 200;
        this.$('.battler-vote')[0].style.width = (v.battlersP * width) + 'px';
        this.$('.battlees-vote')[0].style.width = (v.battleesP * width) + 'px';

    },

    renderComments : function () {
        this.commentComponent = new CommentComponent({
            region : new Backbone.Marionette.Region({
                el : this.$('[data-reg="comments"]'),
            }),
            type : 'battle',
            _id : this.model.get('_id'),
            collection : new CommentCollection(this.model.get('comments'))
        }).show();
    },

    __relatedBattleClicked : function (e) {
        var id = $(e.currentTarget).attr('data-mod');
        Shredr.navigate('/#battle/' + id, {trigger: true});
    },

    // create a playable list of battle videos that can
    // be played in the correct battle order
   getOrderedBattleVids : function () {
       var battleVids = [];
       var rounds = this.model.get('rounds');
       for (var i = 0, z = 0; i < rounds.length; i++) {
           battleVids[z++] = {
               sel : this.$battlerVids[i],
               vidStartSec : parseInt(rounds[i][0].startSec, 10),
               vidStartFramesOffset: parseInt(rounds[i][0].startFrame, 10)
           }
           if ( this.$battleeVids[i] ) {
               battleVids[z++] = {
                   sel : this.$battleeVids[i],
                   vidStartSec : parseInt(rounds[i][1].startSec, 10),
                   vidStartFramesOffset: parseInt(rounds[i][1].startFrame, 10)
               }
           }
       }

       return battleVids;
   },

   renderPlaySeconds : function (seconds) {
       var mins = Math.floor(seconds / 60);
       var secs = seconds % 60;
       this.ui.duration.text(mins + ':' + secs);
   },

   renderNextVideo : function (currVid, peekVid) {
       setTimeout(function() {
         currVid.pause();
         currVid.currentTime = 0;
         $(currVid).hide();
       })

       setTimeout(function() {
           $(peekVid).show();
       })
   },

   renderPlayScreen : function () {
       this.$('.large-in').fadeOut();
       this.$('[data-evt="play"]').fadeOut();
   },

   // Play clicked! must set up the videoplayer component and start playing..
   __playClicked : function () {
       this.vpComponent = new VPComponent({
           videos : this.getOrderedBattleVids(),
           audio : this.$('audio')[0]
       });
       this.listenTo(this.vpComponent, 'player:seconds', this.renderPlaySeconds);
       this.listenTo(this.vpComponent, 'player:next', this.renderNextVideo);
       this.renderPlayScreen();
       this.vpComponent.play();
   },

   __voteClicked : function (e) {
       this.model.postVote($(e.currentTarget).attr('data-model'));
   }
});

return BattleDetailLayout;
});
