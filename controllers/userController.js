var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	shredsController = require('./shredsController'),
	battleService = require('../services/battleService'),
	client = require('../libs/responseClient'),
	Query = require('../libs/query'),
	BaseController = require("./baseController"),
	userService    = require('../services/userService'),
	extend = require('util')._extend;

var renderIndex = function(req, res, user, err) {
	if (err) {return res.render('index', err);}

	shredsController.list(req, function(shreds, err) {
		if (err) { return res.render('index', err);}
		return res.render('index', {
			user : user,
			shreds : shreds
		});
	});
};


var onLogin = function (req) {
	battleService.findAndClearBattles(req.user);
};

var login = function (req, res) {
	onLogin(req);
	res.send(req.user);
};

module.exports = BaseController.extend({

	showStageView : function (req, res) {
		userService.list()
		.then(function (users) {
			module.exports.render(req, res, {
				collBS : users,
				type : 'users',
				tpl : 'stage/stageUsersLayout'
			});
		})
		.fail(function(err) {
			console.log('err: ' + err);
		})
	},

	show : function(req,res){
		userService.load(req.params.id)
		.then(function(user) {
			module.exports.render(req, res, {
				modelBS : user,
				type : 'users',
				tpl : 'user/userLayout'
			});
		}, function(err) {
			console.log('err: ' + err);
		});
	},

	query : function (req, res) {
		return Query.UsersQuery.query(req.query, function (err, result) {
			if ( err ) {
			res.send(err, 400);
			} else {
			res.send(result);
			}
		});
	},

	list : function(req, res) {
		var page = req.param('page');
		if ( !page ) { page = 1;}
		page = (page > 0 ? page : 1) - 1;
		var perPage = 10;
		var options = {
			perPage: perPage,
			page: page
		};

		User.list(options, client.send.bind(this,res));
	},

	update : function(req,res) {
		var user = req.user;
		user = extend(user, req.body);

		user.save(function(err) {
			if (!err) {
			return res.send(user);
			} else {
				console.log('error: ' + err);
				return res.send({'Error' : 'Failed to save'}, 401);
			}
		});
	},

	index : function(req,res) {

		if ( req.session.passport.user ) {
			var userId = req.session.passport.user;
			User.findOne({ _id: userId }, function (err, doc) {
				if (err){
					renderIndex(req, res, {}, err);
				}
				console.log('User is logged in: ' + doc);
				renderIndex(req, res, doc);
			});
		} else {
			console.log('User is not logged in');
			renderIndex(req, res, {});
		}
	},

	create : function(req, res) {
		userService.create(req.body)
		.then(function (user) {
			// manually login the user once successfully signed up
			// logIn is a passport function (passport.request.js)
			req.logIn(user, function () {
				login();
			});
		})
		.fail(client.error.bind(null,res));
	},

	deleteNotification : function(req, res) {
		var user = req.user;
		var notId = req.params.nid;
		var notifications = user.notifications;
		var len = notifications.length;
		var toDel = -1;
		for (var i = 0; i < len; i++) {
			if ( notifications[i].id.toString() === notId ) {
				toDel = i; break;
			}
		}

		if ( toDel > -1 ) {
			notifications.splice(toDel, 1);
		}

		user.save(client.send.bind(this,res));
	},

	login : function (req, res) {
		login(req, res);
	},

	getById : function (req, res) {
		User.load(req.params.id, function (err, user) {
			if ( err ) {
				return res.send (err, 400);
			} else {
				return res.send (user);
			}
		});
	},

	clearNotifications : function (req, res) {
		var userId = req.params.id;
		if ( req.user._id.toString() !== userId ) {
			return client.error(res, 'Not authorized', 401);
		}

		userService.clearNotifications(req.user)
		.then(client.send.bind(null, res,null), client.error.bind(null, res) )
		.done();
	},

	addFan : function (req, res) {
		userService.addFan(req.params.faneeId, req.user)
		.then(client.send.bind(null, res, null), client.error.bind(null, res))
		.done();
	},

	logout : function(req,res){
		req.logout();
		res.redirect('/');
	},

	signup : function(req,res){

	},

	/**
	* Session
	*/
	session : function(req, res) {
		login(req, res);
	},

	signin : function(req,res) {},

	authCallback : function(req,res) {
		onLogin(req);
		res.redirect('/');
	},

	user : function(req,res){

	},

	youtube : function(req,res) {
		res.render('youtube');
	},

});
