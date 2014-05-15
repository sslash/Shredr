var mongoose    = require('mongoose'),
	client = require('../libs/responseClient'),
	Shred 	   = mongoose.model('Shred'),
	Q 	       = require('q'),
	User 		= mongoose.model('User');

var UsersQuery = {
	query : function (query, next) {
		var options = {
			criteria : {},
			page : 0,
			perPage : 20
		};
		options.criteria.username = query.username;
		User.list(options, next);
	}
}

// TODO: make user query and shreds query use this function
// OPS: There used to be a second argument 'query'. This shouldn't be used
var query = function (Model, opts, res) {
	var deferred = Q.defer();
	opts = opts || {};

	var options = {
		criteria : opts.criteria || {},
		populate : opts.populate || '',
		page : opts.page || 0,
		perPage : opts.perPage || 32
	};

	Model.list(options, function (err, doc) {
		if ( res ) {
			client.send(res, err, doc);
		} else {
			if ( err ) { deferred.reject(err); }
			else { deferred.resolve(doc); }
		}
	});
	return deferred.promise;
};

module.exports.UsersQuery = UsersQuery;
module.exports.query = query;
