const { body, validationResult } = require("express-validator");
const round = require("../model/round");

// Handle Category create on POST.
exports.round_create_post = [
  // Validate that the name field is not empty.
  body("roundname", "Round name required").isLength({ min: 1 }).trim(),
  // Sanitize (trim and escape) the name field.
  body("roundname").trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.]
    // alert("message you want to show");

    const rounds = new round({ roundname: req.body.roundname });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("round.hbs", {
        //   title: 'Create Subject',
        rounds: rounds,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      round.findOne({ roundname: req.body.roundname }).exec(function (err) {
        if (err) {
          return next(err);
        } else {
          rounds.save(function (err) {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            // res.redirect(category.url);
            // alert("message")

            res.render("round.hbs");
            console.log(rounds);
          });
        }
      });
    }
  },
];

// Display list of all Rouns.
exports.round_list = function (req, res, next) {
  Promise.all([round.find().lean().exec()]).then(([list_round]) => {
    res.render("roundlists", {
      title: "round List",
      list_round: list_round,
    });
  });
  // round.find().lean()
  //   .exec(function (err, list_round) {
  //     if (err) {
  //       return next(err);
  //     }
  //     // Successful, so render.
  //     res.render('roundlists', {
  //       title: 'round List',
  //       list_round: list_round,
  //     });
  //     // console.log(list_subject)
  //   });
};

// Delete a user with specified user id in the request
exports.delround = (req, res) => {
  round.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/list_rounds");

    } else {
      console.log("Error while deleting", err);
    }
  });
};

exports.roundupdate = function (req, res) {
  let readquery = req.params.id;
  round.updateOne(
      { roundname: readquery },
      {
        $set: {
          roundname: req.body.roundname,
        },
      }
    )
    .then((x) => {
      // req.flash('sucess', 'Your Data has update')
      res.redirect("/Addround");
    })
    .catch((y) => {
      console.log(y);
    });
};
