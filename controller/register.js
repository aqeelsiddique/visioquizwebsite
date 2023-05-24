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
  Subject.find().lean()
    .exec(function (err, list_subject) {
      if (err) {
        return next(err);
      }
      
      // Successful, so render.
      res.render('subjectmain', {
        title: 'subject List',
        list_subject: list_subject,

        
      });
      console.log(list_subject)
    });
};

///////////////Update A data
exports.update =  (req, res) => {

  Subject.findById(req.params.id, (err, doc) => {
    if (!err) {
        res.render("Subject_Add.hbs", {
            viewTitle: "Update Employee",
            employee: doc
        });
    }
});
}
// Delete a user with specified user id in the request
exports.delete = (req, res)=>{

  Subject.findByIdAndDelete(req.params.id, (err, doc)=>{
    if(!err){
        res.redirect('/list_subjects');            
    } else {
        console.log('Error while deleting', err)
    }
});
}




// delete one quiz Subject

// Display Category delete form on GET.
// exports.category_delete_get = function (req, res, next) {
//   st.parallel(
//     {
//       category: function (callback) {
//         Subject.findById(req.params.id).exec(callback);
//       },
//       category_processes: function (callback) {
//         Process.find({ category: req.params.id }).exec(callback);
//       },
//     },
//     function (err, results) {
//       if (err) {
//         return next(err);
//       }
//       if (results.category == null) {
//         // No results.
//         res.redirect('/list_subjects');
//       }
//       // Successful, so render.
//       res.render('/list_subjects', {
//         title: 'Delete Category',
//         category: results.category,
//         category_processes: results.category_processes,
//       });
//     }
//   );
// };
// exports.delSubject = st function(req, res) {
//   try {
//       const _id = req.params.id 
//       const question = await Subject.deleteOne({_id})
//       if(question.deletedCount === 0){
//           return res.status(404).json()
//       }
//       else{
//           // return res.status(204).json('delete Sucessfully')
//           res.redirect('/list_subjects' )
//       }
//   } catch (error) {
//     // return res.redirect('list_subjects')
//     // return res.send('succesSS')
//     return res.status(500).json({"error":error})
//   }
// }
// // Handle Category delete on POST.
// exports.category_delete_post = function (req, res, next) {
//   st.parallel(
//     {
//       category: function (callback) {
//         Subject.findById(req.params.id).exec(callback);
//       }
//       // category_processes: function (callback) {
//       //   Process.find({ category: req.params.id }).exec(callback);
//       // },
//     },
//     function (err, results) {
//       if (err) {
//         return next(err);
//       }
//       // // Success
//       // if (results.category_processes.length > 0) {
//       //   // Category has pprocesses. Render in same way as for GET route.
//       //   res.render('category_delete', {
//       //     title: 'Delete Category',
//       //     category: results.category,
//       //     category_processes: results.category_processes,
//       //   });
//       //   return;
//       // }
//        else {
//         // Category has no pprocesses. Delete object and redirect to the list of categories.
//         Subject.findByIdAndRemove(req.body.id, function deleteCategory(err) {
//           if (err) {
//             return next(err);
//           }
//           // Success - go to categories list.
//           res.redirect('/list_subjects');
//         });
//       }
//     }
//   );
// };



