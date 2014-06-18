var mongoose = require('mongoose'),
	Q        = require('q'),
	config   = require('../config/config'),
	Schema   = mongoose.Schema,
	Shred;


/**
* Shred Schema
*/
var ShredSchema = new Schema({
	title: {type : String, default : '', trim : true},
	type: {type : String, default : '', trim : true},
	description: {type : String, default : '', trim : true},
	views : {},
	rating: {
		rating : {type : Number, default : 0 },
		raters : {}
	},
	tabs: {},
	thumb : {type : String},
	youtubeUrl : {type : String, default : '', trim : true},
	youtubeId : {type : String, default : '', trim : true},
	user: {type : Schema.ObjectId, ref : 'User'},
	comments: [{
		body: { type : String, default : '' },
		user: { type : Schema.ObjectId, ref : 'User' },
		createdAt: { type : Date, default : Date.now }
	}],

	shredTags: {type: []},
	gearTags: {type: []},
	jamtrackTag : {type : String},
	fileId : {type : String},
	createdAt  : {type : Date, default : Date.now}
});


/**
* Validations
*/
ShredSchema.path('title').validate(function (title) {
	return title.length > 0;
}, 'Shred title cannot be blank');

ShredSchema.path('user').validate(function (user) {
	return typeof user !== "undefined" && user !== null ;
}, 'Shred must have an owner');


/**
* Pre-remove hook
*/
ShredSchema.pre('remove', function (next) {
	// Do stuff before removing
	next();
});

/**
* Instance Methods
*/
ShredSchema.methods = {

	saveOrUpdate : function (populate, next) {
		var deferred = Q.defer();
		this.save(function(err, shred) {
			if (err) { deferred.reject(err); }
			else {
				if ( populate ) {
					Shred.populate(shred, {path : 'comments.user', model : 'User'}, function (err, result) {
						deferred.resolve(result);
					});
				} else {
					deferred.resolve(shred);
				}
			}
		});
		return deferred.promise;
	},

	/**
	* Save the shred
	*
	* @param {data} shred data
	* @param {Function} cb
	* @api private
	*/
	create: function (cb) {
		this.save(cb);
	},

	// Logic should be in service.....
	rate : function(user, rate) {
		var def = Q.defer();
		var ratingSet = false;

		if (!this.rating.raters ) {
			this.rating.raters = {};
		}
		var rateObj = this.rating.raters[user];

		// If user has rated; then substract that value first
		if ( rateObj ) {
			this.rating.rating -= parseInt(rateObj, 10);
		}

		// after, add the new rate value
		this.rating.rating += rate;

		this.rating.raters[user] = rate;
		this.markModified('rating');

		console.log('Rated! ' + rate + ' Rate now: ' + JSON.stringify(this.rating));
		this.save(function(err, res) {
			if ( err ) { def.reject(err); }
			else { def.resolve(res); }
		});

		return def.promise;
	},
	// 
	// tryIncreaseview : function(userOrIp) {
	// 	var def = Q.defer();
	//
	// 	if ( !this.views[userOrIp] ) {
	// 		this.views[userOrIp] = true;
	// 		this.markModified('views');
	// 		this.save(function(err, res) {
	// 			if ( err ) { def.reject(err); }
	// 			else { def.resolve(res); }
	// 		});
	// 	} else {
	// 		def.resolve(this);
	// 	}
	//
	// 	return def.promise;
	// },

	getNumberOfViews : function () {
		return Object.keys(this.views).length;
	},

	getRating : function () {
		var rating = this.rating;
		return rating.rating / Object.keys(rating.raters).length;
	}

};


/**
* Static functions
*/
ShredSchema.statics = {

	/**
	* Find Shred by id
	*
	* @param {ObjectId} id
	* @param {Function} cb
	* @api private
	*/
	findById: function (id) {
		var deferred = Q.defer();
		this.findOne({ _id : id })
		.populate('user')
		.populate('comments.user')
		.exec(function (err, res) {
			if (err) { deferred.reject(err); }
			else { deferred.resolve(res); }
		});
		return deferred.promise;
	},

	findSimple : function (id) {
		var deferred = Q.defer();
		this.findOne({ _id : id })
		.exec(function (err, res) {
			if (err) { deferred.reject(err); }
			else { deferred.resolve(res); }
		});
		return deferred.promise;
	},

	/**
	* List shreds
	*
	* @param {Object} options
	* @param {Function} cb
	* @api private
	*/
	list: function (options, cb) {
		var deferred = Q.defer();
		var criteria = options.criteria || {};
		var populate = options.populate || '';

		this.find(criteria)
		.populate(populate)
		.sort({'createdAt': -1}) // sort by date
		.limit(options.perPage)
		.skip(options.perPage * options.page)
		.exec(function(err, res) {
			if ( cb ) { cb(err,res); }
			else {
				if ( err ) { deferred.reject(err); }
				else { deferred.resolve(res); }
			}
		});

		return deferred.promise;
	},

	getShredsByUserId : function (userId) {
		var def = Q.defer();
		this.find({user : userId})
		.sort({'createdAt' : -1})
		.populate('comments.user')
		.exec(function(err, res) {
			if ( err ) { deferred.reject(err); }
			else { deferred.resolve(res); }
		});

		return def.promise;
	}
};

Shred = mongoose.model('Shred', ShredSchema);
