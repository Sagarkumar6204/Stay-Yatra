// -------------------- Load .env in Development --------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// -------------------- Requires --------------------
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");

const User = require("./models/user.js");
const Listing = require("./models/listing");

// -------------------- Basic App Setup --------------------
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.ATLASDB_URL;

// -------------------- MongoDB Connection --------------------
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// -------------------- Session Store --------------------
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600
});


store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000
  }
};

// -------------------- Session + Flash (IMPORTANT ORDER) --------------------
app.use(session(sessionOptions));
app.use(flash());

// -------------------- Passport Setup --------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- Global Middleware (locals) --------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// -------------------- Home Route --------------------
app.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// -------------------- Demo User --------------------

// -------------------- Routes --------------------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// -------------------- Error Handler --------------------
app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  res.status(statusCode).render("listings/error", { err });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
