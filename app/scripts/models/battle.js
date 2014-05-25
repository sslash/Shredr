define([
	'backbone',
	'models/user'
],
function( Backbone, User ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({

		urlRoot : '/api/battle/',

		/**
		* Send a battle round instance
		* First upload battle-video
		* Then, if ok, upload meta data
		*/
		postBattleRound : function (opts) {
			var url = '/api/battle/' + this.get('_id') + '/postBattleRound/video';
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
			var url = '/api/battle/' + this.get('_id') + '/postBattleRound';
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

		getRounds : function () {
			return this.get('rounds');
		},

		getLastRound : function () {
			var rounds = this.getRounds();
			return rounds[rounds.length-1];
		},

		getLastVideo : function () {
			var round = this.getLastRound();
			return round.length === 2 ? round[1] : round[0];
		},

		// User's participation in this battle
		usersPart : function () {
			var userId = Shredr.user.get('_id');
			if ( this.get('battler')._id === userId ) {
				return 'battler';
			} else if ( this.get('battlee')._id === userId ) {
				return 'battlee';
			} else {
				return false;
			}
		},

		isUsersTurn : function () {
			var usersPart = this.usersPart();
			if ( !usersPart ) { return false; }
			var lastRound = getLastRound();

			// its the users turn if he is battler
			// and the battle needs a new round
			if ( usersPart === 'battler' && lastRound.length === 2 ) {
				return true;

			// its the users turn if he is battlee
			// and last round lacks video #2
			} else if (usersPart === 'battlee' && lastRound.length === 1 ) {
				return true;
			} else {
				return false;
			}
		},

		postVote : function (battlerOrBattlee) {
			var url = '/api/battle/' + this.get('_id') + '/vote/' + battlerOrBattlee;
			var dat = this;
			$.post(url)
			.done(function(res) {
				dat.set({'votes' : res.votes});
			})
			.fail(function(err) {
				// user has probably already voted
				dat.trigger('battle:save:fail' + err);
			});
		},

		getVotes : function () {
			var votes = this.get('votes');
			var sum = votes.battlers.length + votes.battlees.length;

			votes =  {
				battlers : votes.battlers.length,
				battlees : votes.battlees.length,
				battlersP : (votes.battlers.length / sum) || 0,
				battleesP : (votes.battlees.length / sum) || 0
			};

			if ( votes.battlersP === 0 && votes.battleesP === 0 ) {
				votes.battlersP = votes.battleesP = 0.5;
			}
			return votes;
		}
	});
});
