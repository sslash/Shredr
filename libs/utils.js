var getUserId = function (req) {
    if ( req.session.passport.user ) {
        return req.session.passport.user.toString();
    } else {
        return null;
    }

};

var getUserOrIp = function (req) {
    return getUserId(req) || req.ip;
};

module.exports = {
    getUserId : getUserId,
    getUserOrIp : getUserOrIp
};
