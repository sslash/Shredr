var express  = require('express'),
mongoStore  = require('connect-mongo')(express),
mongoConfig = require('./mongoConfig'),
pkg         = require('../package'),
hbs = require('express-hbs'),
path = require('path');

module.exports = function (app, config, passport) {
    app.set('showStackError', true);

    // use express favicon
    app.use(express.favicon())

    app.use(express.static( path.join( __dirname, '../public') ));
    app.use(express.static( path.join( __dirname, '../.tmp') ));
    app.use(express.static( path.join( __dirname, '../app') ));
    app.use(express.logger('dev'));

    // views config
    app.engine('hbs', hbs.express3({
        partialsDir: __dirname + '../app/templates/partials'
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '../app/templates');

    app.configure(function () {
        // bodyParser should be above methodOverride
        app.use(express.bodyParser({uploadDir:'./uploads'}));
        app.use(express.methodOverride());
        app.use(express.logger('dev'));

        // cookieParser should be above session
        app.use(express.cookieParser());
        app.use(express.session({
            secret: pkg.name,
            store: new mongoStore({
                url: mongoConfig.getDbUrl(),
                collection : 'sessions'
            })
        }));

        // Passport session
        app.use(passport.initialize());
        app.use(passport.session());

        // routes should be at the last
        app.use(app.router);

        app.use(function (req, res, next) {
            res.status(404).render('404', { url: req.originalUrl });
        });
    });

    // development specific stuff
    app.configure('development', function () {
        app.locals.pretty = true;
        app.use(express.errorHandler());
    });

    // staging specific stuff
    app.configure('staging', function () {
        app.locals.pretty = true;
    });
};
