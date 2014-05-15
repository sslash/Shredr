var responseClient = {
	send : function(res, err, doc) {
		console.log('err: ' + err  + ', doc: ' + doc);
		if ( err ) {
			res.send(err, 500);
		} else {
			res.send(doc, 200);
		}
	},

	error : function (res, errorMsg, errorCode) {
		errorCode = errorCode || 400;
		res.send({error : errorMsg}, errorCode);
	}
};

module.exports = responseClient;
