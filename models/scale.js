var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Scale Schema
 */
var ScaleSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  createdAt  : {type : Date, default : Date.now},
  tabs: {},
  tabsKey : {type : String, default : '', trim : true}
});

/**
 *
 */
ScaleSchema.path('title').validate(function (title) {
  return title.length > 0;
}, 'Scale title cannot be blank');

ScaleSchema.path('user').validate(function (user) {
  return typeof user !== "undefined" && user !== null ;
}, 'Scale must have an owner');


/**
 * Pre-remove hook
 */
ScaleSchema.pre('remove', function (next) {
  // Do stuff before removing
  next();
});

/**
 * Instance Methods
 */
ScaleSchema.methods = {

  /**
   * Save the Scale
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
ScaleSchema.statics = {

  /**
   * Find Scale by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */
  findById: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user')
      .exec(cb);
  },

  /**
   * List Scales
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

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

mongoose.model('Scale', ScaleSchema);
