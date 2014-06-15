var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    mongoConfig = require('./mongoConfig'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'shredr'
    },
    facebook: {
      clientID: "322423007904195",
      clientSecret: "d7fd67f5fbda8a09badbce0f0d2ea102",
      callbackURL: "http://localhost:9000/auth/facebook/callback"
    },
    port: 9000
  },

  test: {
    root: rootPath,
    app: {
      name: 'shredr'
    },
    port: 9000
  },

  production : {
    root: rootPath,
    port: process.env.PORT || 5000,
    facebook: {
      clientID: "322423007904195",
      clientSecret: "d7fd67f5fbda8a09badbce0f0d2ea102",
      callbackURL: "http://localhost:5000/auth/facebook/callback"
    },
  }
};

module.exports = config[env];
