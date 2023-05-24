const { body, validationResult } = require("express-validator");
const admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const express = require('express');
const session = require('express-session');
const catchayncerror = require("../middleware/catchayncerror");





const nodemailer = require ('nodemailer');
const ErrorHandler = require("../untils/errorhandler");
const sendEmail = require("../untils/senEmail");


const app = express();

// initialize session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
////asyn code
const adminreg = async (req, res) => {
  //this code line means agr humy specfie data chaiyae tu yeh estmal kr sgthy
  const { name, email, password, cpassword } = req.body;
  console.log(req.file);

  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "plz filled the field properly" });
  }
  try {
    const userExist = await admin.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email alredy Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not match" });
    } else {
      const user = new admin({
        name,
        email,
        password,
        cpassword,
        image: req.file.filename,
      });
      ///save hony sy phylae hashed mae change keo password
      await user.save();

      res.redirect("/admin");

      // res.status(201).json({ message: "user register succesfully" });
      console.log("user", user);
    }
  } catch (err) {
    console.log(err);
  }
};



const admininfo = function (req, res, next) {
  admin
    .find()
    .lean()
    .exec(function (err, admininfo) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("main.hbs", {
        layout: false,
        title: "",
        admininfo: admininfo,
      });
      console.log("jjjj", admininfo);
    });
};
// list of all Question.
const admin_lists = function (req, res, next) {
  admin
    .find()
    .lean()
    .exec(function (err, lists_admin) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("adminlists", {
        title: "",
        lists_admin: lists_admin,
      });
    });
};
const admindelete = (req, res) => {
  admin.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/adminlists");
    } else {
      console.log("Error while deleting", err);
    }
  });
};

///LOGIN  ROUTE
const adminlogin =  async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "invalid" });
    }
    const userlogin = await admin.findOne({ email: email });
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      // const token = await userlogin.generateAuthToken();

      // console.log(token)
      // res.cookie('jwttoken', 'Aqeel', {
      //     expires: new Date(Date.now() + 25892000000),
      //     httpOnly: true
      // })
      ///create a cokki4res.cokkie
      if (!isMatch) {
        res.status(422).send({ message: "user error" });
      } else {
        // res.send({ meassage: " wellcome user  login sucessfully" });
        res.redirect('/dashboard')
      }
    } else {
      res.status(422).send({ message: "invalidss" });
    }
  } catch (err) {
    console.log(err);
  }

};
const adminlogout =  function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/adminlogin');
    }
  });
};
//logout functionnn
const logout = catchayncerror(async (req, res, next) => {
  res.cookie("token", null, {
    experies: new Date(Date.now()),
    httpOnly:true

  });
  res.redirect("/adminlogin")

  // res.status(200).json({
  //   success:true,
  //   message:"logout"
  // })


})

////////////////////////forgot Password////////////////////
const forgetPassword = catchayncerror(async (req, res, next) => {
  const user = await admin.findOne({email: req.body.email});
  // console.log(user)

  if (!user) {
    return next(new ErrorHandler("user not found", 404))
  } 
  // Send an email with the random string to the user
  sendEmail(user.name, user.email, user.randomString);
  
  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} successfully`
  });

  // rest of the function code ...
});
const updateadmin = (req, res)=> {
  let readquery = req.params.id;
    admin.updateOne({name:readquery}, {
        $set:{
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          cpassword: req.body.cpassword,
          image: req.file.filename,

        }
    })
    .then((x)=>{
        // req.flash('sucess', 'Your Data has update')
        res.redirect('/adminlists')
    })
    .catch((y)=>{
        console.log(y)
    })
  
}






module.exports = {
  adminreg,
  admininfo,
  admin_lists,
  admindelete,
  adminlogin,
  adminlogout,
  forgetPassword,
  logout,
  updateadmin
};
