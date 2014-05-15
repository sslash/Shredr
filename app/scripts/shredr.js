define([
	'backbone.marionette',
	'router',
	'models/user',
	'controllers/baseController',
	'controllers/authController',
	'collections/shredsCollection',
	'collections/battlesCollection'
], function(Marionette, Router, User, BaseController, AuthController,
			ShredsCollection, BattlesCollection) {
    'use strict';

	var Shredr = new Marionette.Application();
	window.Shredr = Shredr;
	Shredr.options = _.extend({}, window.app_options);

	window.RAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
	window.CRAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	Backbone.Model.prototype.setDateString = function (date) {
		if ( !(date instanceof Date) ) { date = new Date(date); }
		var curr_date = date.getDate();
		var curr_month = date.getMonth();
		var curr_year = date.getFullYear();
		var str = curr_date + '-' + curr_month + '-' + curr_year;
		this.set({'dateString': str});
	};

	Shredr.addRegions({
		navRegion : '#navigation',
		flashRegion : '#flash',
		kickerRegion : '#kicker',
		mainRegion : '#main',
		modalRegion : '#modal'
	});

	Shredr.navigate = function (route, opts) {

		// flag saying we are rendering on the client from now on
		this.cliRender = true;
		Backbone.history.navigate(route, opts);
	};

	Shredr.addInitializer (function(options) {

		// Collection is just raw json data until the initial
		// responsible controller parses it
		if ( options.collection ) {
			if ( options.type === 'shreds' ) {
				this.collection = new ShredsCollection(options.collection);
			} else if ( options.type === 'battles' ) {
				this.collection = new BattlesCollection(options.collection);
			}
		}

		if ( options.model ) {
			this.model = options.model;
		}

		this.router = new Router();
		this.authController = new AuthController();

		if (!options.user.notLoggedIn) {
			this.authController.silentLogin(new User(options.user));
		} else {
			Shredr.user = new User(options.user);
		}

		this.baseController = new BaseController();
		Backbone.history.start({pushState:true});
	});

	Shredr.setCollection = function (coll) {
		this.collection = coll;

		// Change to exec?
		if ( this.collection.models.length === 0 ) {
			this.collection.fetch({reset : true});
		}
	};

	Shredr.start(Shredr.options);
	return Shredr;
});
