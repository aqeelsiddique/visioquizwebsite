
const mongoose = require('mongoose')
const SubjectSchema = new mongoose.Schema({

    ///////////////////////in bleow schemma not make a code 
    // _id: mongoose.Schema.Types.ObjectId,
    // username: { type: String, required: true, lowercase: true, trim: true },
    //  username : {type : String }
    subjectname: {type :String , required: true , trim: true},
   
    
    
    

    
     
  
    
    
    
    })
//     // employeeSchema
// var empSchema = new mongoose.Schema({
//     full_name: {
//         type: String,
//         required: 'Please enter full name.'
//     },
//     email: {
//         type: String
//     },
//     mobile: {
//         type: String
//     },
//     address: {
//         type: String
//     },
//     salary: {
//         type: String
//     }
// });

// // email validation
// empSchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Please enter valid e-mail addtess.');

// module.exports =  mongoose.model('empModel', empSchema);
////////////////////////////////////////////
    
module.exports = mongoose.model('Subjectvs', SubjectSchema)

    
    
    