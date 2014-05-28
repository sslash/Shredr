var mongoose = require('mongoose'),
	Q        = require('q'),
	config   = require('../config/config'),
	Schema   = mongoose.Schema;


/**
* Shred Schema
*/
var ShredSchema = new Schema({
	title: {type : String, default : '', trim : true},
	type: {type : String, default : '', trim : true},
	description: {type : String, default : '', trim : true},
	rating: {
		rating : {type : Number, default : 0 },
		raters : {}
	},
	tabs: {},
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


	rate : function(user, rate, cb) {

		var ratingSet = false;

		if (!this.rating.raters ) {
			this.rating.raters = {};
		}
		var rateObj = this.rating.raters[user._id];

		// If user has rated; then substract that value first
		if ( rateObj ) {
			this.rating.rating -= parseInt(rateObj, 10);
		}

		this.rating.raters[user._id] = rate;

		this.rating.rating += rate;

		console.log('Rated! Rate now: ' + JSON.stringify(this.rating));
		this.save(cb);
	},

	/**
	* Add comment
	*
	* @param {User} user
	* @param {Object} comment
	* @param {Function} cb
	* @api private
	*/

	addComment: function (user, comment, cb) {
		//var notify = require('../mailer/notify') // Email notify

		this.comments.push({
			body: comment,
			user: user._id
		});

		// notify.comment({
		//   article: this,
		//   currentUser: user,
		//   comment: comment.body
		// });

		this.save(cb);
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

	getShredsByUserId : function (userId, cb) {
		this.find({user : userId})
		.sort({'createdAt' : -1})
		.populate('comments.user')
		.exec(cb);
	}
};

mongoose.model('Shred', ShredSchema);
