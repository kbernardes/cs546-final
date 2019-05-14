const session = require('express-session')
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");
const data = require("./data");

// We create our express isntance:
const app = express();
const static = express.static(__dirname + "/public");

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(static);

app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

/*
// Authentication middleware
app.get('/private', async function (req, res, next) {
  // check current session id with user sid's
  if ((req.session.sessionID === undefined) || (!req.session.sessionID) || (req.session.sessionID !== (await usersData.findBySessionID(req.session.sessionID)).sessionID)) {
    res.status(403).render("error", {errorMsg: "User not logged in"})
    return;
  }
  next();
});
*/

configRoutes(app);

app.listen(3000, () => {
  console.log("Server started!");
  console.log("Your routes will be running on http://localhost:3000");
});