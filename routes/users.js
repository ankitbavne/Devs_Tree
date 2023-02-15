const router = require("express").Router();
// const router = require("express")
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const validator = require("../validator/validator");
let jwt = require("jsonwebtoken");
const config = require("../config.json");

let saltRounds = 10;

//authentication functionality using JWT token
let verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const isVerified = jwt.verify(token, config.secretKey);
    if (isVerified) {
      req["userId"] = isVerified._id;
      next();
    } else {
      res.status(400).json({
        message: "Unauthorised access",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Invalid credential",
    });
  }
};
router.get("/get/profile", verifyToken, async (req, res) => {
  try {
    let userId = req.userId;
    let userData = await User.findOne({ _id: userId }).select(
      "-password -createdAt -updatedAt -__v"
    );
    res.status(200).json({
      status: "SUCCESS",
      message: "User data retrived successfully",
      data: userData,
    });
  } catch (err) {
    res.status(301).json({
      status: "FAILURE",
      message: "Something went wrong",
    });
  }
});

// get all users API
router.get("/getAll/users", verifyToken, async (req, res) => {
  try {
    let { search } = req.query;
    let result;
    if (search && search != "") {
      result = await User.find({ fullName: { $regex: search, $options: "i" } });
    } else {
      result = await User.find();
    }
    if (result.length != 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: "User data retrived successfully",
        data: result,
      });
    } else {
      res.status(200).json({
        status: "FAILURE",
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(301).json({
      status: "FAILURE",
      message: "Something went wrong",
    });
  }
});
module.exports = router;
