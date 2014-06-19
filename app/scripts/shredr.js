define([
	'backbone.marionette',
	'router',
	'models/user',
	'models/shred',
	'models/battle',
	'controllers/baseController',
	'controllers/authController',
	'collections/shredsCollection',
	'collections/usersCollection',
	'collections/battlesCollection'
], function(Marionette, Router, User, Shred, Battle, BaseController, AuthController,
			ShredsCollection, UsersCollection, BattlesCollection) {
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

	window.printz = function(str, obj) {
		console.log(str+ ' ' + JSON.stringify(obj, null, '\t'));
	}

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
		Shredr.cliRender = true;
		Backbone.history.navigate(route, opts);
	};

	Shredr.setCollection = function (coll) {
		Shredr.collection = coll;

		// Change to exec?
		if ( Shredr.collection.models.length === 0 ) {
			Shredr.collection.fetch({reset : true});
		}
	};

	Shredr.updateUser = function (newUser) { this.user = new User(newUser);}

	Shredr.setModel = function (model) {
		Shredr.model = model;
	};

	function setModelAndCol(options, Model, Coll) {
		var model = (options.model && options.model._id) ?
			new Model(options.model, {parse:true}) : null;
		this.setModel(model);

		this.setCollection(new Coll(options.collection));
	};

	Shredr.addInitializer (function(options) {

		// create youtubeplayer tag
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		// Collection is just raw json data until the initial
		// responsible controller parses it
		if ( options.collection ) {

			if ( options.type === 'shreds' ) {
				setModelAndCol.call(this, options, Shred, ShredsCollection);

			} else if ( options.type === 'battles' ) {
				setModelAndCol.call(this, options, Battle, BattlesCollection);

			} else if (options.type === 'users' ) {
				setModelAndCol.call(this, options, User, UsersCollection);
			}
		}

		this.router = new Router();
		this.authController = new AuthController();

		if (!options.user.notLoggedIn) {
			this.authController.silentLogin(new User(options.user));
		} else {
			Shredr.updateUser(options.user);
		}

		this.baseController = new BaseController();
		Backbone.history.start({pushState:true});
	});

	Shredr.start(Shredr.options);
	return Shredr;
});
