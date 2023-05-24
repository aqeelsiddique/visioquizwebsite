const controller = require('../controller/questions');
var Controller = require('../controller/questions');
const { ObjectId } = require('mongodb');
const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const subject = require('../controller/subject');
const subjectmodel = require('../model/subject');
const Team = require('../controller/team');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

const bcrypt = require('bcryptjs');
const dashboard = require('../controller/dashboard');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const admin = require("../model/admin");
const async = require('async');
const flash = require('connect-flash');

app.use(cookieParser());
app.use(flash());

const {
  eventhead_list,
  eventdelete,
  updateprofile,
  updateeventhead,
} = require('../controller/evenhead');
const multer = require('multer');
var fs = require('fs');
const image = require('../model/image');
const User = require('../model/Head');
// const bcrypt = require("bcryptjs");
const path = require('path');
const {
  adminreg,
  admininfo,
  admin_lists,
  admindelete,
  adminlogin,
  adminlogout,
  forgetPassword,
  logout,
  updateadmin
} = require('../controller/admin');
const {
  round_create_post,
  round_list,
  delround,
  roundupdate,
} = require('../controller/round');

const round = require('../model/round');

const team = require('../model/team');
const question = require('../model/question');
const Result = require('../model/resultmodel');
module.exports = function (app) {
const session = require('express-session');

  // app.use((session ({secret:config.SECRET_KEY})))
  //////////////////////////test 0001//////
  // SET STORAGE
  let storage = multer.diskStorage({
    destination: './public/images', //directory (folder) setting
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname); // file name setting
    },
  });
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/gif'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('Only jpeg,  jpg , png, and gif Image allow'));
      }
    },
  });

  
  ///////////test image code
  
  app.get('/test1', function (req, res) {
    res.render('dashboard.hbs', {
      title: 'hello',
    });
  });

  
// Handle form submission
  //////////////////////end test code////////

  // Retrieve all documents in the 'images' collection
  // image.find().toArray(function(err, documents) {
  //   if (err) throw err;

  //   // Render the 'home' template and pass in the array of images as data
  //   res.render('image', { images: documents });

  // });

  ///////////////////dashboard code///////
  app.get('/dashboard', dashboard.eventhead_list);

  //////////////////////////////Final Round wise team enter to DB code
  app.get('/Addround', (req, res) => {
    res.render('round.hbs', {
      roundttitle: 'Add a Round',
    });
  });
  app.post('/Addround', round_create_post);
  app.get('/list_rounds', round_list);
  app.get('/delround/:id', delround);
  app.put('/editround/:id', roundupdate);
  app.get('/editround/:id', (req, res) => {
    let readquery = req.params.id;
    round.findOne({ roundname: readquery }).then((x) => {
      res.render('roundupdate.hbs', { x });
    });
  });
  /////////////////for react js///////////////////////////////////
  app.get('/rounds', async (req, res) => {
    try {
      const rounds = await round.find().lean().exec();
      res.json(rounds);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.get('/selectteams', async (req, res) => {
    const selectedRound = req.query.round;
    const query = selectedRound ? { select_round: selectedRound } : {};
    try {
      const list_Team = await team.find(query).lean().exec();
      res.json(list_Team);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.get('/selecttecams', async (req, res) => {
    const { select_round } = req.query;
    const queryObject = {};
    if (select_round) {
      queryObject.select_round = select_round;
    }
    console.log(queryObject);
    const myData = await team.find(queryObject);
    res.render('teamlist.hbs');
  });


  app.get('/filterteams', async (req, res) => {
    const rounds = await team.distinct('select_round').sort();
    const teamsByRound = [];

    for (const round of rounds) {
      const queryObject = { select_round: round };
      const teams = await team.find(queryObject);
      teamsByRound.push({ round, teams });
    }
    res.render('schedulewiseteams.hbs', { teamsByRound });
    console.log(teamsByRound);
  });





  app.get('/filterteams/:id', async (req, res) => {
    const roundId = req.params.id;
    const queryObject = { select_round: roundId };
    const teams = await team.find(queryObject);
    const teamsByRound = [{ round: roundId, teams }];
    res.render('schedulewiseteams.hbs', { teamsByRound });
    console.log(teamsByRound);
  });

  //////////////////////Subject Wise question show
  app.get('/filterquestion', async (req, res) => {
    const subjects = await question.distinct('select_subject').sort();
    const subjectwise = [];
    for (const subject of subjects) {
      const queryObject = { select_subject: subject };
      const ques = await question.find(queryObject);
      subjectwise.push({ subject, ques });
    }
    res.render('subjectwiseque.hbs', { subjectwise });
    console.log(subjectwise);
  });

  
  // route handler for /filterquestion/:id
  app.get('/filterquestion/:id', async (req, res) => {
    const subjectId = req.params.id;
    const questions = await question.find({ select_subject: subjectId });

    // render the subjectwiseque.hbs template and pass the questions data as a variable
    res.render('subjectwiseque.hbs', { questions });
  });

  app.get('/questions/:id', async (req, res) => {
    try {
      const encodedId = req.params.id;
      const subjectId = decodeURI(encodedId);
      console.log('here is id: ', subjectId);
      let questions;
      if (subjectId) {
        questions = await question.find({ select_subject: subjectId });
      } else {
        throw new Error('No questions found');
      }
      res.status(200).send(questions);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  /////////////////////end round wise code /////////////
  /////////////final done of of Subject Rout
  app.get('/AddSub', (req, res) => {
    res.render('subject_Add.hbs', {
      subjecttitle: 'Add a Subject',
    });
  });
  app.post('/add_Subject', subject.subject_create_post);

  app.put('/editsubject/:id', subject.subjectupdate);

  app.get('/editsubject/:id', (req, res) => {
    let readquery = req.params.id;

    subjectmodel.findOne({ name: readquery }).then((x) => {
      res.render('updatesubject.hbs', { x });
    });
  });
  app.get('/deltedata/:id', subject.delete);
  app.get('/list_subjects', subject.subject_list);



  app.get('/subjects', async (req, res) => {
    try {
      const subjects = await subjectmodel.find().lean().exec();
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.get('/add_Question', controller.process_create_get1);
  app.post('/add_Question', Controller.process_create_post1);
  app.get('/questionlists', controller.question_list);

  app.get('/questions', async (req, res) => {
    const questions = await question.find();
    res.json(questions);
  });
  app.get('/update_Question/:id', (req, res, next) => {
    let readquery = req.params.id;
    question
      .findOne({ ques: readquery })
      .then((x) => {
        Promise.all([subjectmodel.find().lean().exec()])
          .then(([select_subject]) => {
            // Render the view with the data
            res.render('questionupdate.hbs', {
              x,
              title: 'Add Question',
              data: {
                select_subject,
              },
              select_subject: select_subject,
            });
          })
          .catch((err) => {
            // Handle errors here
            return next(err);
          });
      })
      .catch((err) => {
        // Handle errors here
        return next(err);
      });
  });
  app.put('/update_Question/:id', controller.updatequestion);
  app.post('/delete_Question/:id', controller.deletequestion);
  //////////////////////End of Question portion////////////////////////

  ///////////////////////////////////////Team Section/////////////////////////////
  app.get('/createteam', Team.Team_create_get);
  app.post('/addteam', Team.Team_create_post);
  app.get('/teamlist', Team.Team_list);
  app.get('/delete_team/:id', Team.teamdelete);
  // app.post("/updateteam/:id", Team.update);
  app.put('/editteam/:id', Team.teamupdate);

  app.get('/editteam/:id', (req, res, next) => {
    let readquery = req.params.id;
    team
      .findOne({ teamname: readquery })
      .then((x) => {
        Promise.all([round.find().lean().exec()])
          .then(([select_round]) => {
            // Render the view with the data
            res.render('teamupdate.hbs', {
              x,
              title: 'Add Team',
              data: {
                select_round,
              },
              select_round: select_round,
            });
          })
          .catch((err) => {
            // Handle errors here
            return next(err);
          });
      })
      .catch((err) => {
        // Handle errors here
        return next(err);
      });
  });

  ///////////////////////////////////Team Section End//////////////////////////////////
  //////////////////EventHead Section////////////////////
  app.get('/evenhead', (req, res) => {
    res.render('Event_head.hbs');
  });
  app.get('/edit/:id', (req, res) => {
    let readquery = req.params.id;

    User.findOne({ name: readquery }).then((x) => {
      res.render('eventheadupdate.hbs', { x });
    });
  });
  app.put('/edit/:id', upload.single('profile'), updateeventhead);
  app.get('/eventheadlists', eventhead_list);
  app.get('/eventhead_team/:id', eventdelete);
  //////////////////End//////////////////////
  ////asyn code

  app.post('/register', upload.single('profile'), async (req, res) => {
    //this code line means agr humy specfie data chaiyae tu yeh estmal kr sgthy
    const { name, email, password, cpassword } = req.body;
    console.log(req.file);

    if (!name || !email || !password || !cpassword) {
      return res.status(422).json({ error: 'plz filled the field properly' });
    }
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(422).json({ error: 'Email alredy Exist' });
      } else if (password != cpassword) {
        return res.status(422).json({ error: 'password are not match' });
      } else {
        const user = new User({
          name,
          email,
          password,
          cpassword,
          image: req.file.filename,
        });
        ///save hony sy phylae hashed mae change keo password
        await user.save();

        res.redirect('/evenhead');

        // res.status(201).json({ message: "user register succesfully" });
        console.log('user', user);
      }
    } catch (err) {
      console.log(err);
    }
  });
  // app.get("/login", (req, res) => {
  //   res.render("headloginform", {});
  // });
  ///LOGIN  ROUTE
  app.post('/logins', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ error: 'invalid' });
      }
      const userlogin = await User.findOne({ email: email });
      if (userlogin) {
        const isMatch = await bcrypt.compare(password, userlogin.password);
        const token = await userlogin.generateAuthToken();

        console.log('token', token);
        res.cookie('jwttoken', 'Aqeel', {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        ///create a cokki4res.cokkie
        if (!isMatch) {
          res.status(422).send({ message: 'user error' });
        } else {
          res.redirect('/dashboard');

          // res.send({ meassage: " wellcome user  login sucessfully" });
        }
      } else {
        res.status(422).send({ message: 'invalid' });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/logout', logout);

  app.get("/forgot", (req, res) => {
    res.render("forgot")
  })
  // app.post('/forgot', forgetPassword);
  //////////////Admin code section/////////////



  app.get('/admin', (req, res) => {
    res.render('adminprofile.hbs');
  });
  app.get('/adminlogin', (req, res) => {
    res.render('adminlogin');
  });
  app.get('/profile', (req, res) => {
    res.render('profileadmin.hbs');
  });
  app.post('/adminreg', upload.single('profile'), adminreg);
  app.get('/admininfo', admininfo);
  app.get('/adminlists', admin_lists);
  app.get('/adminedit/:id', (req, res) => {
    let readquery = req.params.id;

    admin.findOne({ name: readquery }).then((x) => {
      res.render('updateadmin.hbs', { x });
    });
  });
  app.put('/adminedit/:id', upload.single('profile'), updateadmin);

  app.get('/admindel/:id', admindelete);




////////////////////////////////forgot testing code 

app.get("/forgot", (req, res) => {
  res.render("forgot")
})

app.get("/imageques", (req, res) => {
  Promise.all([subjectmodel.find().lean().exec()]).then(([select_subject]) => {
    res.render("uploadmcqimage", {
      select_subject: select_subject,
    });
  });
})

// Handle POST request for creating a new question
app.post('/questions', upload.single('image'), (req, res) => {

  // Retrieve form data
  const { select_subject, option1, option2, option3, option4, ans } = req.body;
  console.log(req.file);
  const errors = validationResult(req);

  // Save the question data to MongoDB
  const que = new question({
    select_subject: req.body.select_subject,
    image: req.file.filename,
    option1,
    option2,
    option3,
    option4,
    ans
  });

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/error messages.
    async.parallel(
      {
        select_subject: function (callback) {
          subjectmodel.find(callback);
        },
      },
      function (err, results) {
        if (err) {
          return next(err);
        }
        results.select_subject = results.select_subject || []; // Make sure the results object has a select_subject property

        res.render("uploadmcqimage", {
          title: "Create Process",
          select_subject: results.select_subject,
          process: process,
          errors: errors.array(),
        });
      }
    );
    return;
  }

  // Save the question to the database
  que.save(function (err) {
    if (err) {
      return next(err);
    }
    // Successful - redirect to the question list.
    res.redirect('/imageques');
  });
});

///////////////////////////////////Stored a Results////////////////

app.post('/results', async (req, res) => {
  try {
    const { round, teams } = req.body;
    // Create a new result object
    const result = new Result({
      round,
      teams
    });
    // Save the result to the database
    await result.save();

    res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving result', error });
  }
});

app.get('/filterresults', async (req, res) => {
  try {
    // Retrieve the results from the database
    const results = await Result.find();

    // Render the Handlebars template and pass the results data
    res.render('results.hbs', { results });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving results', error });
  }
});

//////////////////////////////////End OF Result Code////////////////////









};
