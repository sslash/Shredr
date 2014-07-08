// TODO: find a way to remove unfinished battlerequests...
var mongoose   = require('mongoose'),
    Q          = require('q'),
    Schema     = mongoose.Schema;

var BattleSchema = new Schema({

    // Initiator
    battler: {type : Schema.ObjectId, ref : 'User'},

    // receiver. Sort of
    battlee: {type : Schema.ObjectId, ref : 'User'},

    winner : {type : Schema.ObjectId, ref : 'User'},

    completed : {type : Boolean, default : false},

    numRounds : {type : Number, default: 2},

    dayLimit : {type : Number, default: 5},

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
            //     duration : Number // only for simplemode.
            //                       // Each simplemode video starts right after the prev finishes
            //     rating : {
            //         raters : {type : Number, default : 0},
            //         currentValue : {type : Number, default : 0}
            //     },
            // },
            // {
            //    // round 2
            //    things.. same as above...
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
    },


    // copied from backbone battle.js. SHould find a way to share..
    getLastRound : function () {
        var rounds = this.rounds;
        return rounds[rounds.length-1];
    },

    getLastVideo : function () {
        var round = this.getLastRound();
        return round.length === 2 ? round[1] : round[0];
    },

    // check it last video in battle is either:
    // last round, or if not, check if the last video is later then
    // dayLimit ago
    checkIfFinished : function () {
        if ( this.completed === true ) {return true;}

        var dayLimit = this.dayLimit;
        var today = new Date();

        // deadline day is #dayLimit days after lastVideoDate
        var lastVideoDate = this.getLastVideo().createdAt;
        var deadlineDay = new Date().setDate(lastVideoDate.getDate() + dayLimit);

        // FINISHED!
        if ( deadlineDay < today ) {

            // Time has now run out! Ie battler or battlee hasn't responeded since
            // last due day.

            // If alle rounds are done, battle has completed normally.
            // finish by vote
            if ( this.rounds.length === this.numRounds && this.getLastRound().length === 2 ) {
                return this.setFinishedByVote();

            // else, one of them has simply not responded.. The other is then the winner!
            } else {
                return this.setFinishedWithLastRound();
            }
        }
    },

    setFinishedByVote : function () {
        var winner,
            battlers = this.votes.battlers.length,
            battlees = this.votes.battlees.length;

        if (battlers > battlees) { winner = this.battler; }
        else if (battlees > battlers) { winner = this.battlee; }
        else { winner = null; } // tie

        return this.finishBattle(winner);
    },

    setFinishedWithLastRound : function () {
        this.completed = true;

        // lastRound has 2 videos ?
        var winner = this.getLastRound().length === 2 ?
            // then battlee was the last. Or else battler was the last
            this.battlee : this.battler;

        return this.finishBattle(winner);
    },

    // set this.completed
    // set the winner reference,
    // and send messages to winner and looser
    // returns a promise
    finishBattle : function (winner) {
        var def = Q.defer();
        this.completed = true;
        this.winner = winner;
        var battle = this, finishMsg;
        var winnerRec = winner, looserRec;

        if (winner) {
            var looserRec = winner._id.toString() === this.battler._id.toString() ?
                this.battlee : this.battler;

        // Tie..
        } else {
            finishMsg = 'Battle Finished. It was a tie!';

            // not the actual winner/looser.
            // Just correct references for notifications below
            winnerRec = this.battler; looserRec = this.battlee;
        }

        this.save(function(err, res) {

            if (err) { throw err; }

            // send message to users saying battle is finished.
            // it would be nicer if user service could listen
            // to some event and do the job itself, but whatevs.
            Q.all([
                winnerRec.addNotification({
                    type : 6,
                    body : finishMsg || 'Battle Finished. You Won!',
                    referenceId : battle._id.toString()
                }),

                // send looser notification

                looserRec.addNotification({
                    type : 6,
                    body : finishMsg || 'Battle Finished. You Lost.',
                    referenceId : battle._id.toString()
                })
            ]).then(def.resolve, def.reject).done();
        });

        return def.promise;
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

    load: function (id, cb) {
        var deferred = Q.defer();
        this.findOne({ _id : id })
        .populate('battler')
        .populate('battlee')
        .populate('winner')
        .populate('jamtrackId')
        .populate('comments.user')
        .exec(function(err,res) {
            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });
        return deferred.promise;
    },

    findMany : function (ids, opts) {
        opts || (opts = {});
        opts.populate = opts.populate || [];

        var deferred = Q.defer();
        this.find({ '_id': { $in: ids } })
        .populate(opts.populate)
        .exec(function(err, res) {

            if (err) { deferred.reject(err); }
            else { deferred.resolve(res); }
        });

        return deferred.promise;
    }
};

mongoose.model('Battle', BattleSchema);
