const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TeamSchema = new Schema({
//   select_round: { type: Schema.Types.ObjectId, ref: 'round', required: true ,
// },
select_round: { type: String, ref: 'round', required: true ,
},
universityname: { type: String, required: true, min: 3, max: 100 },

  teamname: { type: String, required: true, min: 3, max: 100 },
  
  member1: { type: String, required: true, min: 3, max: 100 },
  member2: { type: String, required: true, min: 3, max: 100 },
  member3: { type: String, required: true, min: 3, max: 100 },

});

// Virtual for this category instance URL.
// CategorySchema.virtual('url').get(function() {
//   return '/dashboard/category/' + this._id;
// });
//Export model.

module.exports = mongoose.model('team', TeamSchema);
////////done
