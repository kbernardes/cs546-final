const express = require("express");
const router = express.Router();
const usersData = require("../data");
const uuid = require("node-uuid");

router.get("/", async (req, res) => {
    res.render("frontpage");
});

router.get("/login", async (req, res) => {
    // check if user is signed in, redirect to / if they are
    res.render("login");
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check that user exists
    let user = await usersData.findUser(username);
    if (user === false) {
        req.session.auth = false;
        res.status(401).render("loginerror", {errorMsg: "Username not valid"});
        return;
        //res.redirect("/");
    }
    
    // Check if password is correct
    const passChk = await usersData.checkPass(username, password);
    if (passChk === false) {
        req.session.auth = false;
        res.status(401).render("loginerror", {errorMsg: "Password incorrect"});
        return;
    }

    req.session.sessionID = uuid.v4();
    user.sessionID = req.session.sessionID;
    res.redirect("/profile/" + username);
});

router.get("/signup", async (req, res) => {
    res.render("signup");

});

router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    await usersData.createUser(username, password, email, firstName, lastName);
    
    req.session.sessionID = uuid.v4();
    user.sessionID = req.session.sessionID;
    res.redirect("/");
});

router.get("/logout", async(req, res) => {
    let user = await usersData.userSID(req.session.sessionID);
    req.session.sessionID = undefined;
    user.sessionID = req.session.sessionID;
    res.render("logout");
});

router.get("/profile/:username", async (req, res) => {
    // renders different file if user is accessing their own 
});

router.put("/profile/:username", async (req, res) => {
    // user must be logged in and can only update their own profile
});

module.exports = router;
