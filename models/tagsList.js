var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var TagsListSchema = new Schema({
    shredTags: {type: []},
    gearTags: {type: []}
});

TagsListSchema.methods = {
};

TagsListSchema.statics = {

    // Tryes to append both shred tags and gear tags
    appendTags : function (tagsObject, next) {
        this.findOne({})
        .exec(function(err,res) {
            if (err) { next(); }
            else {

                if ( tagsObject.shredTags ) {
                    res.shredTags = _.union(res.shredTags, tagsObject.shredTags);
                }

                if ( tagsObject.gearTags ) {
                    res.gearTags = _.union(res.gearTags, tagsObject.gearTags);
                }

                res.save(next);
            }
        })
    },

    getShredTags: function (cb) {
        this.findOne({})
        .exec(function(err, res){
            cb.call(null, err, {shredTags : res.shredTags});
        });
    },

    getGearTags: function (cb) {
        this.findOne()
        .exec(function(err, res){
            cb.call(null, err, {gearTags : res.gearTags});
        });
    }
};


mongoose.model('TagsList', TagsListSchema);
