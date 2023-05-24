// import Resul from '../models/Resultmodel.js'
const { body, validationResult } = require('express-validator');
// const st = require('st');

const Subject = require('../model/subject');

// let alert = require('alert'); 


// Handle Category create on POST.
exports.subject_create_post = [
  // Validate that the name field is not empty.
  body('name', 'Subject name required').isLength({ min: 1 }).trim(),
  // Sanitize (trim and escape) the name field.
  body('name').trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.]
    // alert("message you want to show");

    const subject = new Subject({ name: req.body.name });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('Subject_Add.hbs', {
        title: 'Create Subject',
        subject: subject,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Subject.findOne({ name: req.body.name 
      }).exec(function (
        err,
        found_subject
      ) {
        if (err) {
          return next(err);
        }
        if (found_subject) {
          // Category exists, redirect to its detail page.
          res.redirect(found_subject.url);
        } else {
          subject.save(function (err) {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            // res.redirect(category.url);
            // alert("message")

            res.render('Subject_Add.hbs')
          });
        }
      });
    }
  },
];
// Display list of all Subject.
exports.subject_list = function (req, res, next) {
  Promise.all([
    Subject.find().lean().exec()

  ]).then(([list_subject]) => {
    res.render("subjectmain", {
      list_subject: list_subject,

    })
  })
  
  
};
///////////////Update A data //https://github.com/CodAffection/Node.js-Expess-MongoDB-CRUD/blob/74a11aee717bcb9773d1360314e20dbf7248d33e/project/controllers/employeeController.js#L31
///////////////Update A data
exports.subjectupdate = function(req, res) {
  let readquery = req.params.id;
    Subject.updateOne({name:readquery}, {
        $set:{
          name: req.body.name,
        }
    })
    .then((x)=>{
        // req.flash('sucess', 'Your Data has update')
        res.redirect('/AddSub')
    })
    .catch((y)=>{
        console.log(y)
    })
  
}


// exports.update =  (req, res) => {
//   Subject.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
//     if (!err) { res.redirect('/add_Subject'); }
//     else {
//         if (err.name == 'ValidationError') {
//             handleValidationError(err, req.body);
//             res.render("Subject_Add", {
//                 viewTitle: 'Update subject',
//                 employee: req.body
//             });
//         }
//         else 
//             console.log('Error during record edit : ' + err);
//     }
// });
// }

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

  Subject.findByIdAndDelete(req.params.id, (err, doc)=>{
    if(!err){
        res.redirect('/list_subjects');
        console.log("suce",doc)            
    } else {
        console.log('Error while deleting', err)
        console.log("hgyt",doc)            

    }
});
}






