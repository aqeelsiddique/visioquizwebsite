const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
  },
  teams: [
    {
      universityname: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
