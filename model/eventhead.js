const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const ObjectId = require('mongodb').ObjectId;
// const id = new ObjectId();
const eventheadSchema = new mongoose.Schema({
    


    name: {
        type: String,

    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    confirmpassword: {
        type: String
    }
///////////////////////in bleow schemma not make a code 
    // description: String,
    
    // alternatives: [
    //     {
    //         text: {
    //             type: String,
    //             required: true
    //         },
    //         isCorrect: {
    //             type: Boolean,
    //             required: true,
    //             default: false
    //         }
    //     }
    // ]
})
module.exports = mongoose.model('eventhead', eventheadSchema)
