var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NytSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  summary: {
    type:String,
    required:true
  },
  date: {
    type:String,
    required:true
  },
  byline: {
    type:String,
    required:true
  },
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});

var Nyt = mongoose.model('Nyt', NytSchema);
module.exports = Nyt;
