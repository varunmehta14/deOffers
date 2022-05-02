const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const registerRouter = require("./routes/register");
const offerRouter = require("./routes/deoffer");
// const addtaskRouter = require("./routes/addtask");
const auth = require("./routes/auth");
var bodyParser = require('body-parser')
const {initializeBlockchain}=require('./config/blockchain')
initializeBlockchain();
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(                //this mean we don't need to use body-parser anymore
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// app.use(bodyParser.urlencoded({limit: '50mb',  extended: true,parameterLimit:50000 }));
app.use(cors());


app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
// console.log(process.env)
if (!process.env.task_jwtprivate) {
  console.log("FATAL ERROR: jwtprivate key not defined.");
  process.exit(1);
}

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established sucessfully");
});

app.use("/register", registerRouter);
app.use("/offer", offerRouter);
// app.use("/home", addtaskRouter);
app.use("/auth", auth);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to user application." });
  // res.setHeader("Access-Control-Allow-Origin", "*")
});
app.listen(PORT, () => console.log(`Server starting at port ${PORT}`));
