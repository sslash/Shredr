/**
* Status codes:
* 401 - Unauthorized
* 400 - Bad Request
* 500 - Internal server error
* 501 - Not implemented
*/

var responseClient = {
	send : function(res, err, doc) {
		if ( err ) {
			res.send(err, 500);
		} else {
			res.send(doc, 200);
		}
	},

	error : function (res, errorMsg, errorCode) {
		errorMsg || (errorMsg = errorMsg.toString());
		console.log('ERR: ' + errorMsg);
		errorCode = errorCode || 400;
		res.send({error : errorMsg}, errorCode);
	}
};

module.exports = responseClient;
