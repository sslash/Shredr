var mongoose    = require('mongoose'),
	Shred 		= mongoose.model('Shred');

var ShredsQuery = {
	query : function (query, next) {
		var options = {
			query : {},
			page : 0,
			perPage : 20,
			populate : 'user'
		};
		options.query.type = query.type;
		Shred.list(options, next);
	}
};

module.exports = ShredsQuery;