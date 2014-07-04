var async = require('async'),
auth = require('./middlewares/authorization'),
http = require('https'),
path = require('path'),
userController     = require('../controllers/userController'),
shredsController   = require('../controllers/shredsController'),
scalesController   = require('../controllers/scalesController'),
jamtracksController    = require('../controllers/jamtracksController'),
conversationController = require('../controllers/conversationController'),
tagsController         = require('../controllers/tagsController'),
battleController       = require('../controllers/battleController'),
battleRequestController= require('../controllers/battleRequestController'),
workspaceController    = require('../controllers/workspaceController');


module.exports = function(app, passport){
  'use strict';

  app.get('/', shredsController.showStageView);
  app.get('/stage/shreds', shredsController.showStageView);
  //  app.get('/', function(req, res) {
  //      // fetch data
  //      var fullBootstrap = {
  //          user : JSON.stringify({name : 'Yolo Swagtown'}),
  //          title: 'My favorite veggies',
  //          layout: '../layout'
  //      };
  //
  //      res.render(path.join( __dirname, '../app/templates/stage/stageShredsLayout' ) ,fullBootstrap);
  //  });

  // app.get('/', userController.index);
  app.get('/youtube', userController.youtube);


  // app.get('/login', userController.login);
  // app.get('/signup', userController.signup);
  app.get('/logout', userController.logout);

  // battles
  app.get('/battle/:id', battleController.show);
  app.get('/battle', battleController.list);

  // shreds
  app.get('/shred/:id', shredsController.show);

  // users
  app.get('/stage/users', userController.showStageView);
  app.get('/users/:id', userController.show);

  // workspace
  app.get('/workspace', workspaceController.show);


  // ****************** API ************************ //

  // Shreds
  app.post('/api/shreds/', auth.requiresLogin, shredsController.create);
  app.get('/api/shreds/query', shredsController.query);
  app.get('/api/shreds/:id', shredsController.get);
  app.post('/api/shreds/:id/rate', auth.requiresLogin, auth.requiresLogin, shredsController.rate);
  app.post('/api/shreds/:id/comment', auth.requiresLogin, shredsController.comment);
  app.post('/api/shreds/:id/upload', auth.requiresLogin, shredsController.upload);
  app.post('/api/shreds/:id/hej_jeg_kigger', shredsController.tryIncreaseView);

  // Users
  app.get('/api/user/query', userController.query);
  app.put('/api/user/:id', auth.requiresLogin, userController.update);
  app.get('/api/user/:id', userController.getById);
  app.get('/api/user', userController.list);
  app.post('/api/user/:id/clearNotifications', auth.requiresLogin, userController.clearNotifications);
  app.post('/api/user', userController.create);
  app.post('/api/user/:id/addFan/:faneeId', auth.requiresLogin, userController.addFan);
  app.post('/api/user/:id/deleteNotification/:nid', auth.requiresLogin, userController.deleteNotification);

  // Tags
  app.get('/api/tags/shreds', tagsController.getShredTags);
  app.get('/api/tags/gear', tagsController.getGearTags);

  // Scales
  app.post('/api/scales', auth.requiresLogin, scalesController.create);
  app.get('/api/scales/:id', scalesController.get);
  app.get('/api/scales', scalesController.list);

  // Jamtracks
  app.get('/api/jamtracks', jamtracksController.list);
  app.get('/api/jamtracks/:id', jamtracksController.get);
  app.post('/api/jamtracks', auth.requiresLogin, jamtracksController.create);
  app.post('/api/jamtracks/:id/upload', auth.requiresLogin, jamtracksController.upload);

  // Battlerequests
  app.post('/api/battleRequest/:id/postBattleRound/video', auth.requiresLogin, battleRequestController.uploadInitialVideo);
  app.post('/api/battleRequest/:id/postBattleRound', auth.requiresLogin, battleRequestController.updateBattleRequest);

  app.post('/api/battleRequest/:id/:mode/uploadFile', auth.requiresLogin, battleRequestController.uploadJamtrack);
  //app.post('/api/battleRequest/:id/Advanced/uploadVideoFile', auth.requiresLogin, battleRequestController.uploadInitialBrVideoAdvanced);
  app.post('/api/battleRequest/:id/accept', auth.requiresLogin, battleRequestController.acceptBattleRequest);
  app.post('/api/battleRequest/:id/decline', auth.requiresLogin, battleRequestController.declineBattleRequest);
  app.get('/api/battleRequest/:id', auth.requiresLogin, battleRequestController.getBattleRequest);
  app.post('/api/battleRequest', auth.requiresLogin, battleRequestController.create);
  //app.put('/api/battleRequest/:id', auth.requiresLogin, battleRequestController.updateBattleRequest);

  // battles
  app.post('/api/battle/:id/postBattleRound/video', auth.requiresLogin, battleController.postBattleRoundVideo);
  app.post('/api/battle/:id/postBattleRound', auth.requiresLogin, battleController.postBattleRound);
  app.post('/api/battle/:id/vote/:battlerOrBattlee', auth.requiresLogin, battleController.postVote);
  app.post('/api/battle/:id/comment', auth.requiresLogin, battleController.postComment);
  app.get('/api/battle/:id', battleController.getJSON);


  app.post('/users/session',
  passport.authenticate('local', {
    //failureRedirect: '/login',
    //failureFlash: 'Invalid email or password.'
  }), userController.session);

  app.post('/api/conversation', auth.requiresLogin, conversationController.create);
  app.get('/api/conversation/:id', auth.requiresLogin, conversationController.get);
  app.post('/api/conversation/:id/sendMessage', auth.requiresLogin, conversationController.sendMessage);





  // social logins
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: [ 'email', 'user_about_me'],
    failureRedirect: '/login'
  }), userController.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
  }), userController.authCallback);

  // TODO: This is code for authenticating with youtube
  // It doesnt work..
  // app.get('/auth/google/callback', function (req,res) {

  // 	var data = {
  // 		code : req.query.code,
  // 		client_id : '845386364672-e9phdl0vv2kehoefs9gedepf2t5js3t9.apps.googleusercontent.com',
  // 		client_secret : '68faY8p6qrHNMFqj0MGq2Kax',
  // 		redirect_uri : '/#loginsuccess',
  // 		grant_type : 'authorization_code'
  // 	};

  // 	var userString = JSON.stringify(data);

  // 	var headers = {
  // 		'Content-Type': 'application/x-www-form-urlencoded',
  // 		'Content-Length': userString.length
  // 	};

  // 	var options = {
  // 		hostname: 'accounts.google.com',
  // 		port: 443,
  // 		path: '/o/oauth2/token',
  // 		method: 'POST',
  // 		headers: headers
  // 	};
  // 		console.log("sap2 " + req.params);

  // 	var request = http.request(options, function(response) {
  // 		console.log("sap");
  // 		response.setEncoding('utf-8');

  // 		var responseString = '';

  // 		response.on('data', function(data) {
  // 			responseString += data;
  // 		});

  // 		response.on('end', function() {
  // 			console.log("end: " + responseString);
  // 			var resultObject = JSON.parse(responseString);
  // 		});
  // 	});

  // 	request.on('error', function(e) {
  // 		console.log("err: " + e);
  // 	});

  // 	request.write(userString);
  // 	request.end();
  // });


  app.param('userId', userController.user);
};
