const mongoose = require("mongoose");
let config= require("../config.json")
mongoose.set("strictQuery", false);
mongoose
  .connect(config.dbUrl)
  .then(() => {
    console.log("Database connected succsessfully");
  })
  .catch((error) => {
    console.log(`"Unable to connect database", ERROR : ${error}`);
  });
