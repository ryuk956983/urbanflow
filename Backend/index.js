const express = require("express");

var cookieParser = require('cookie-parser');
var app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
require('dotenv').config();
const userRouter = require("./routes/users");

var app = express();
app.get('/', (req, res) => {
  res.send('Hello World!')

})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:"https://urbanflow-e6yj.onrender.com",
    credentials:true
}))

app.use(bodyParser.json());
app.use(cookieParser());

try{
  mongoose.connect(process.env.MONGOOSE_CONNECTION);
  console.log("database connected");
}catch(err){
  console.log("database not connected",err.message);
}
app.use("/user",userRouter);
app.listen(process.env.PORT || 5000)

module.exports = app;
