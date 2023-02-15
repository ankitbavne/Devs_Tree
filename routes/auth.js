const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const validator = require("../validator/validator");
let jwt = require("jsonwebtoken");
const config = require("../config.json");

let saltRounds = 10;

router.post("/register", validator.registration(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = await User.findOne({
      email: req.body.email,
    });
    if (userData) {
      res.status(201).json({
        status: "SUCCESS",
        message: "User already registerd",
      });
    } else {
      let data = req.body;
      bcrypt.genSalt(saltRounds, async function (err, salt) {
        bcrypt.hash(data.password, salt, async function (err, hash) {
          data["password"] = hash;
          var user = await new User(data).save();
          if (user) {
            res.status(201).json({
              status: "SUCCESS",
              message: "User registerd successfully",
              data: user,
            });
          } else {
            res.status(301).json({
              status: "FAILURE",
              message: "Something went wrong",
            });
          }
        });
      });
    }
  } catch (err) {
    res.status(301).json({
      status: "FAILURE",
      message: "Something went wrong",
    });
  }
});

// login API
router.post("/login", validator.login(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let findUser = await User.findOne({ email: email });
    if (!findUser) {
      res.status(400).json({
        status: "FAILURE",
        message: "email not found",
      });
    } else {
      findUser = JSON.parse(JSON.stringify(findUser));
      let matchPasword = await bcrypt.compare(password, findUser.password);
      if (matchPasword) {
        let token = await jwt.sign(findUser, config.secretKey, {
          expiresIn: "24h",
        });
        findUser["token"] = `Bearer ${token}`;
        res.status(200).json({
          status: "SUCCESS",
          message: "User login successfully",
          data: findUser,
        });
      } else {
        res.status(400).json({
          status: "FAILURE",
          message: "email or password is incorrect",
        });
      }
    }
  } catch (err) {
    res.status(301).json({
      status: "FAILURE",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
