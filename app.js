const bodyParser = require("body-parser");
const { Decimal128 } = require("bson");
var express = require("express");
require("dotenv").config();
var app = express();
var mongoose = require("mongoose");
const { Schema } = mongoose;

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connection established");
} catch (e) {
  console.log("Error connecting to database");
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const userSchema = new Schema({
  walletId: { type: String, unique: true },
  rides: [
    {
      geoLocation: Buffer,
      startDate: Date,
      endDate: Date,
      greenAmount: Decimal128,
      distance: Number,
    },
  ],
});

const User = mongoose.model("User", userSchema);

app.post("/user/:id/ride", (req, res) => {
  let ride = {
    geoLocation: req.body.geoLocation,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    greenAmount: req.body.greenAmount,
    distance: req.body.greenAmount,
  };
  User.find({ walletId: req.params.id }, (err, data) => {
    if (err) res.sendStatus(400);
    user.rides.push(ride);
    user.save((err1, data1) => {
      if (err1) res.sendStatus(400);
      res.sendStatus(200);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/user/:id", (req, res) => {
  User.find({ walletId: req.params.id }, (err, data) => {
    if (err) res.sendStatus(400);
    if (data.length == 0) {
      let newUser = new User({ walletId: req.params.id, rides: [] });
      newUser.save((err1, data1) => {
        if (err1) res.sendStatus(400);
        else res.sendStatus(200);
      });
    } else res.send(data);
  });
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server listening on port " + port);
});
