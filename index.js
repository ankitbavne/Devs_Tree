const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
require("./databaseConnection/dbconnection");
let config = require("./config.json");

let multer = require("multer");
let staticFilesUrl = "http://localhost:5000/";
const bcrypt = require("bcrypt");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

function enableStaticFileServer(expressInstance, folderName, route) {
  app.use(route, express.static(path.join(__dirname, folderName)));
}

enableStaticFileServer(app, "public", "/");

// multer functionality for uploading file purpose
let uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./public");
    },
    filename: (req, file, callback) => {
      req.originalName = Date.now() + "-" + file.originalname;
      callback(null, req.originalName);
    },
  }),
}).any();

// upload API
app.post("/upload/user/profile_pic", (req, res) => {
  if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public");
  } else {
    if (!fs.existsSync("./public")) {
      fs.mkdirSync("./public");
    }
  }
  uploadImage(req, res, (err) => {
    var files = [];
    req.files.forEach((ele) => {
      files.push(staticFilesUrl + ele.filename);
    });

    res.status(200).json({
      status: "SUCCESS",
      data: files,
    });
  });
});

app.listen(config.server.port, () => {
  console.log(`Server is running at port ${config.server.port}`);
});
