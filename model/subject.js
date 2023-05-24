const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MachineSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  date_of_retirement: { type: Date }
});
//Export model
module.exports = mongoose.model('testsubj', MachineSchema);

