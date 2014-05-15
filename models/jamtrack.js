var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Scale Schema
 */
var JamtrackSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  createdAt  : {type : Date, default : Date.now},
  tags: {type: []},
  fileId : {type : String, default: ''},
  relatedShreds : [{type : Schema.ObjectId, ref : 'Shred'}]
});

/**
 *
 */
JamtrackSchema.path('title').validate(function (title) {
  return title.length > 0;
}, 'Jamtrack title cannot be blank');

JamtrackSchema.path('user').validate(function (user) {
  return typeof user !== "undefined" && user !== null ;
}, 'Jamtrack must have an owner');


/**
 * Pre-remove hook
 */
JamtrackSchema.pre('remove', function (next) {
  // Do stuff before removing
  next();
});

/**
 * Instance Methods
 */
JamtrackSchema.methods = {

  /**
   * Save the Jamtrack
   *
   * @param {data} Scale data
   * @param {Function} cb
   * @api private
   */
  create: function (cb) {
   this.save(cb);
  }
};



/**
 * Static functions
 */
JamtrackSchema.statics = {

  findById: function (id, next) {
    this.findOne({ _id : id })
      .populate('user relatedShreds')
      .exec(next);
  },

  findByTitle : function(title,next) {
      this.findOne({title : title})
      .exec(next);
  },

  list: function (options, cb) {
    var criteria = options.criteria || {};
    var populate = options.populate || '';

    this.find(criteria)
      .populate(populate)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(function(err, res) {
        cb(err,res);
      });
  }
};

mongoose.model('Jamtrack', JamtrackSchema);
