const { body, validationResult } = require("express-validator");
const async = require("async");
const team = require("../model/team");
const subject = require("../model/subject");
const question = require("../model/question");
const User = require("../model/Head");
const admin = require("../model/admin")

// exports.index = function (req, res) {
  // async.parallel(
  //   {
  //     team_count: function (callback) {
  //       team.countDocuments({}, callback);
  //     },
  //     subject_count: function (callback) {
  //       subject.countDocuments({}, callback);
  //     },
  //     question_count: function (callback) {
  //       question.countDocuments({}, callback);
  //     },
  //     eventheadlist: function (callback) {
  //       User.find().lean()
  //       .exec({}, callback)
  //     },
  //   },

    

  //   function (err, results) {
  //     res.render('dashboard', {
  //       title: 'Dashboard Home',
  //       error: err,
  //       data: results,
  //       list_EventHead:results
  //     });
  //     console.log("tttt",results)

  //   }

//   );
  
// };
// exports.eventhead_list = function (req, res, next) {
//   async.parallel(
//     {
//       team_count: function () {
//         team.countDocuments({});
//       },
//       subject_count: function () {
//         subject.countDocuments({});
//       },
//       question_count: function () {
//         question.countDocuments({});
//       },
//       eventheadlist: function () {
//         User.find().lean().exec()
//       },
//       adminlist: function () {
//         admin.find().lean().exec()
//       },
//     },
//     function (err, results) {
//       if (err) { return next(err); }
//       // Successful, so render.
//       res.render('dashboard', {
//         title: 'Admin Dashboard',
//           data: results,

//         list_EventHead: results.eventheadlist,  
//         admininfo: results.adminlist
//       });
//     }
//   );
// };
exports.eventhead_list = function (req, res, next) {
  Promise.all([
    team.countDocuments({}),
    subject.countDocuments({}),
    question.countDocuments({}),
    User.find().lean().exec(),
    admin.find().lean().exec()
  ])
  .then(([team_count, subject_count, question_count, eventheadlist, adminlist]) => {
    // Render the view with the data
    res.render('dashboard', {
      title: 'Admin Dashboard',
      data: {
        team_count,
        subject_count,
        question_count,
        eventheadlist,
        adminlist
      },
      list_EventHead: eventheadlist,  
      admininfo: adminlist
    });
  })
  .catch((err) => {
    // Handle errors here
    return next(err);
  });
};