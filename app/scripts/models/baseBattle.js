define([],
function() {
    'use strict';
    return {
      /**
      * Send a battle round instance
      * First upload battle-video
      * Then, if ok, upload meta data
      */
      postBattleRound : function (opts) {
        var url = this.url() + '/postBattleRound/video';
        opts.uploadComponent.upload(url);
        this.listenTo(opts.uploadComponent, 'file:upload:success',

        // video sent. now send meta
        this.postBattleRoundMeta.bind(this, opts));
      },

      /**
      * Called when video has been uploaded for a new round
      * sends a post to the server
      */
      postBattleRoundMeta : function (meta) {
        var url = this.url() + '/postBattleRound';
        var dat = this;
        $.post(url, {
          startFrame : meta.startFrame,
          startSec : meta.startSec
        })
        .done(function(res) {
          dat.set({'rounds' : res.rounds});
          dat.trigger('battle:save:success', dat);
        })
      },

      getCurrentRound : function () {
        if ( this.get('rounds') ) {
          return this.getRounds().length;
        } else { return 1; }
      },

      getRounds : function () {
        return this.get('rounds') || 1;
      }
    }
});
