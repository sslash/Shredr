var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var BadgeSchema = new Schema({
    title : {type: String},
    img : {type : String},
    description : {type : String},
    background : {type : String}
});


mongoose.model('Badge', BadgeSchema);
