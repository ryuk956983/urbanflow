const userRegister = require("../models/userRegister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")



require("dotenv").config();

const userCTRL = {
registerUser: async (req, res) => {
   
    try {
      const { firstName,lastName, email, password } = req.body;

      const isUser = await userRegister.findOne({ email: email });

      if (isUser) {
        res.json({ "error": "User already Exists" })
      } else {


        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const user = new userRegister({
              firstName: firstName,
              lastName: lastName,
              email:email,
              password: hash

            })

            user.save();

            res.json({ "message": "User created succesfully", "path": "/login" })

          });
        });

      }


    } catch (err) {
      console.log(err);
    }
  },
  loginUser: async (req, res) => {
    const { email, pass } = req.body;


    const isUser = await userRegister.findOne({ email });

    if (!isUser) {
      res.json({ "error": "User doesn't Exist", "path": "/register" })
    } else {

      const { email, password } = isUser;


      bcrypt.compare(pass, password, function (err, result) {


        if (result) {

          const jwtemail = jwt.sign(email, process.env.JWT_TOKEN);

          res.cookie("token", jwtemail, {
            maxAge: 86400000,
            secure: true,
            httpOnly: true,
            path: "/",
            sameSite: 'None'
          });
          res.json({ "message": "Login succesfully", "path": "/" })
        } else {
          res.json({ "error": "Username or password is wrong!" })
        }
      });

    }

  },
  fetchUser: async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      res.json({ "user": token })
    } else {
      const email = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await userRegister.findOne({ email })
      res.json({ user });
    }
  },
  logoutUser: async (req, res) => {
 res.clearCookie("token", {
    path: "/",
    secure: true,      // Must match original
    httpOnly: true,    // Must match original
    sameSite: 'None'   // Must match original
});

    res.json({ "message": "Logged Out Succesfully", "path": "/login" })
  },
}

module.exports = userCTRL;
