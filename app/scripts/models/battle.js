define([
	'backbone',
	'models/user',
	'models/baseBattle'
],
function( Backbone, User, baseBattle ) {
    'use strict';

	var Battle = Backbone.Model.extend({

		urlRoot : '/api/battle/',

		parse : function (attrs) {
			attrs.id = attrs._id;
			attrs.battler = new User(attrs.battler);
			attrs.battlee = new User(attrs.battlee);
			return attrs;
		},

		toJSON : function () {
			var model = Backbone.Model.prototype.toJSON.call(this);
			model.battler = model.battler.toJSON ? model.battler.toJSON() : model.battler;
			model.battlee = model.battlee.toJSON ? model.battlee.toJSON() : model.battlee;
			return model;
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
			if ( this.get('battler').get('_id') === userId ) {
				return 'battler';
			} else if ( this.get('battlee').get('_id') === userId ) {
				return 'battlee';
			} else {
				return false;
			}
		},

		isUsersTurn : function () {
			var usersPart = this.usersPart();
			if ( !usersPart ) { return false; }
			var lastRound = this.getLastRound();

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

		getBattleStatus : function () {
			// Check if finished
			if ( this.get('completed') ) { return 'complete'; }

			// if all rounds are completed
			if (this.getRounds().length === this.get('numRounds') &&
				this.getLastRound().length === 2 ) {
				return 'finalRoundDone';
			} else {
				if ( this.isUsersTurn() ) { return 'usersTurn'; }
				else { return ''; }
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

	_.extend(Battle.prototype, baseBattle);
	return Battle;
});
