const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = require('mongodb').ObjectId;
// const id = new ObjectId();
const QuestionSchema = new mongoose.Schema({
  select_subject: { type: String, ref: 'testsubj', required: true },
  image: {
    type: String,
    required: function () {
      return !this.ques; // Image is required if no question text is provided
    }
  },
  ques: {
    type: String,
    required: function () {
      return !this.image; // Question text is required if no image is provided
    }
  },
  option1: {
    type: String,
    image: String // Image path or URL
  },
  option2: {
    type: String,
    image: String // Image path or URL
  },
  option3: {
    type: String,
    image: String // Image path or URL
  },
  option4: {
    type: String,
    image: String // Image path or URL
  },
  ans: {
    type: String,
    required: function () {
      return !this.correctOption; // Correct option is required if no answer text is provided
    }
  },
  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: 'testsubj'
  },
  correctOption: {
    type: String,
    required: function () {
      return !this.ans; // Correct option is required if no answer text is provided
    }
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
