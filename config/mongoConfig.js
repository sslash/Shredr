var mongoose	= require('mongoose');
var schema		= mongoose.Schema;


exports.connectToMongo = function() {

	var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/shredr';

	// The http server will listen to an appropriate port, or default to
	// port 5000.
	var theport = process.env.PORT || 5000;

	// Makes connection asynchronously.  Mongoose will queue up database
	// operations and release them when the connection is complete.
	mongoose.connect(uristring, function (err, res) {
		if (err) {
			console.log ('ERROR connecting to: ' + uristring + '. ' + err);
		} else {
			console.log ('Succeeded connected to: ' + uristring);
		}
	});

	return uristring;
};

exports.getDbUrl = function(){
	return  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/shredr';
};