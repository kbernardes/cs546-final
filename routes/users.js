const express = require("express");
const router = express.Router();
const usersData = require("../data");
const uuid = require("node-uuid");

router.get("/", async (req, res) => {
    if (await authTest(req) === true) {
      res.redirect("/profile");
    }
    else {
      res.render("login");
    }
    //res.render("login");
});