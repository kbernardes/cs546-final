const express = require("express");
const router = express.Router();
const usersData = require("../data");
const uuid = require("node-uuid");

router.get("/", async (req, res) => {
    res.render("frontpage");
});

// POST sign in

// POST signup
// GET logout
router.get("/logout", async(req, res) => {
    let user = await usersData.userSID(req.session.sessionID);
    req.session.sessionID = undefined;
    user.sessionID = req.session.sessionID;
    res.render("logout");
});

// GET person signed in profile (
// PUT update profile info (password, username, etc.)
// GET someone's public profile