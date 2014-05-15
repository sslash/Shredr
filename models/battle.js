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

    // Advanced mode things
    rounds : [
        {
            // // size : 2
            // turns : [{
            //     videoFileId : String,
            //     createdAt : {type : Date},
            //     rating : {
            //         raters : {type : Number, default : 0},
            //         currentValue : {type : Number, default : 0}
            //     },
            //     // comments: [{
            //     //     body: { type : String, default : '' },
            //     //     user: { type : Schema.ObjectId, ref : 'User' },
            //     //     createdAt: { type : Date, default : Date.now }
            //     // }]
            // }]
        }
    ]
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

    findById: function (id, cb) {
        var deferred = Q.defer();
        this.findOne({ _id : id })
        .populate('battler')
        .populate('battlee')
        .populate('jamtrackId')
        .exec(function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
        return deferred.promise;
    },
};

mongoose.model('Battle', BattleSchema);
