const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const userRouter = require("./routes/user_routes");
const classRouter = require("./routes/pottery_classes_routes");
const photoRouter = require("./routes/photo_routes");
const MongoStore = require("connect-mongo")(session)
const passport = require("passport");
const aws = require('aws-sdk');
require('dotenv').config();

const port = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const whitelist = ["http://localhost:3001", "http://localhost:3000"]
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      // Check each url in whitelist and see if it includes the origin (instead of matching exact string)
      const whitelistIndex = whitelist.findIndex((url) => url.includes(origin));
      callback(null, whitelistIndex > -1);
    },
  })
);

app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 3600000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Database connection
const dbConn = process.env.MONGODB_URI || "mongodb://localhost/SOTRPC";
mongoose.connect(dbConn, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err) => {
        if (err) {
            console.log("Error connecting to database", err);
        } else {
            console.log("Connected to database", dbConn);
        }
});
// Passport initialize
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// S3 initialize

aws.config.update({
  region: 'ap-southeast-2', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})




//Routes
app.use("/users", userRouter);
app.use("/classes", classRouter);
app.use("/photos", photoRouter);

// Home page test
app.get("/", (req, res) => {
    res.send("Welcome")
})


app.listen(port, () => {
    console.log(`SOTRPC app listening on port ${port}`)
})
