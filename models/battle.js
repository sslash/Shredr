// TODO: find a way to remove unfinished battlerequests...
var mongoose   = require('mongoose'),
    Q          = require('q'),
    Schema     = mongoose.Schema;

var BattleSchema = new Schema({

    // Initiator
    battler: {type : Schema.ObjectId, ref : 'User'},

    // receiver. Sort of
    battlee: {type : Schema.ObjectId, ref : 'User'},

    numRounds : {type : Number, default: 1},

    // Simple or Advanced
    mode : String,
    createdAt  : {type : Date, default : Date.now},

    // In case for stored jamtrack (mode2)
    jamtrackFileId : String,

    videoFileId : String,

    // In case for mode2, and the user has chosen an existing jamtrack
    jamtrackId : {type : Schema.ObjectId, ref : 'Jamtrack'},

    votes : {

        // battlers votes (id's to users)
        battlers : [String],

        // battlees votes (id's to users)
        battlees : [String]
    },

    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],

    // Advanced mode things
    rounds : [Schema.Types.Mixed]
    // rounds : [
         // [
         //     {    // round 1
            //     videoFileId : String,
            //     createdAt : {type : Date},
            //     startSec : Number,
            //     startFrame : Number,
            //     rating : {
            //         raters : {type : Number, default : 0},
            //         currentValue : {type : Number, default : 0}
            //     },
            //     comments: [{
            //         body: { type : String, default : '' },
            //         user: { type : Schema.ObjectId, ref : 'User' },
            //         createdAt: { type : Date, default : Date.now }
            //     }]
            // },
            // {
            //    // round 2
            //    things..
            //}
            //]
    // ]
});


BattleSchema.path('battler').validate(function (user) {
    return typeof user !== "undefined" && user !== null ;
}, 'BattleRequest must have an initiator');

BattleSchema.path('battlee').validate(function (user) {
    return typeof user !== "undefined" && user !== null ;
}, 'BattleRequest must have an opponent');

BattleSchema.methods = {
    create: function (cb) {
        this.save(cb);
    }
};

BattleSchema.methods = {
    saveOrUpdate : function (populate, next) {
        var deferred = Q.defer();
        this.save(function(err, battle) {
            if (err) { deferred.reject(err); }
            else {
                if ( populate ) {
                    Battle.populate(battle, {path : 'comments.user', model : 'User'}, function (err, result) {
                        deferred.resolve(result);
                    });
                } else {
                    deferred.resolve(battle);
                }
            }
        });
        return deferred.promise;
    }
};

BattleSchema.statics = {

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

    findSimple : function(id, cb) {
        var deferred = Q.defer();
        this.findOne({ _id : id })
        .exec(function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
        return deferred.promise;
    },

    findById: function (id, cb) {
        var deferred = Q.defer();
        this.findOne({ _id : id })
        .populate('battler')
        .populate('battlee')
        .populate('jamtrackId')
        .populate('comments.user')
        .exec(function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
        return deferred.promise;
    },

    findMany : function (ids) {

        var deferred = Q.defer();
        this.find({ '_id': { $in: ids } }, function(err, res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });

        return deferred.promise;
    }
};

mongoose.model('Battle', BattleSchema);
