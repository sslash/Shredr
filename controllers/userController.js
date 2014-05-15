var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	shredsController = require('./shredsController'),
	client = require('../libs/responseClient'),
	Query = require('../libs/query'),
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
}

exports.youtube = function(req,res) {
	res.render('youtube');
};

exports.query = function (req, res) {
  return Query.UsersQuery.query(req.query, function (err, result) {
    if ( err ) {
      res.send(err, 400);
    } else {
      res.send(result);
    }
  });
};

exports.list = function(req, res) {
	var page = req.param('page');
	if ( !page ) { page = 1;}
	page = (page > 0 ? page : 1) - 1;
	var perPage = 10;
	var options = {
		perPage: perPage,
		page: page
	};

	User.list(options, client.send.bind(this,res));
};

exports.update = function(req,res) {
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
};

exports.index = function(req,res) {

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
};

exports.register = function(req, res){
	var user = new User(req.body)
	user.provider = 'local'
	user.save(function (err) {
		if (err) {
			return res.send(err.errors);
		} else {
			// manually login the user once successfully signed up
			// logIn is a passport function (passport.request.js)
		    req.logIn(user, function(err) {
		      if (err) return next(err)
		      return res.send(user);
		    });
		}
	});
};

exports.deleteNotification = function(req, res) {
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
};

var login = function (req, res) {
  res.send(req.user);
}

exports.getById = function (req, res) {
	User.load(req.params.id, function (err, user) {
		if ( err ) {
			return res.send (err, 400);
		} else {
			return res.send (user);
		}
	});
};

exports.addFan = function (req, res) {
	var faneeId = req.params.faneeId;

	req.user.addFanee(faneeId)
	.then(function() {
		return User.loadSimple(faneeId)
	})
	.then( function(user) {
		return user.addFan(req.user);
	})
	.then ( function (user) {
		return client.send(res, null, user);
	})
	.fail ( function(err) {
		return client.error(res, err);
	})
};


exports.login = function(req,res){

}

exports.logout = function(req,res){
	req.logout();
	res.redirect('/');
}

exports.signup = function(req,res){

}

exports.show = function(req,res){

}

/**
 * Session
 */
exports.session = login;

exports.signin = function(req,res){

}

exports.authCallback = function(req,res){

}

exports.user = function(req,res){

}
