const express = require("express");
const router = express.Router();
const data = require("../data");
const uuid = require("node-uuid");  
const mongoCollections = require("../data/collections");
const users = mongoCollections.users;

router.get("/login", async (req, res) => {
    // check if user is signed in, redirect to / if they are
    res.render("login");
});

router.post("/login", async (req, res) => {
    const userCollection = await users();
    const username = req.body.username;
    const password = req.body.password;

    // Check that user exists
    let user = await data.users.findUser(username);
    if (user === false) {
        res.status(401).render("error", {information: "Username not valid"});
        return;
        //res.redirect("/");
    }
    
    // Check if password is correct
    const passChk = await data.users.checkPass(username, password);
    if (passChk === false) {
        res.status(401).render("error", {information: "Password incorrect"});
        return;
    }

    req.session.sessionID = uuid.v4();
    const updateSID = {
        $set: {sessionID: req.session.sessionID}
    };
    await userCollection.updateOne({ _id: user._id }, updateSID);
    res.redirect("/forums");
});

router.get("/signup", async (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const userCollection = await users();
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const useralready = await data.users.findUser(username);
    console.log(useralready);
    if(useralready === false){
        const user = await data.users.createUser(username, password, email, firstName, lastName);
        req.session.sessionID = uuid.v4();
        const updateSID = {
            $set: {sessionID: req.session.sessionID}
        };
        console.log(user);
        await userCollection.updateOne({ _id: user._id }, updateSID);
        res.redirect("/forums");
    }
    else{
        res.status(402).render("error", {information: "Username already taken, please try a different name"});
    }
});

router.get("/logout", async(req, res) => {
    let user = await data.users.userSID(req.session.sessionID);
    //req.session.sessionID = undefined;
    user.sessionID = undefined;
    req.session.regenerate(function (err) 
    {
        req.session.sessionID = "";
    });
    res.render("logout");
});
/*
router.get("/profile/:username", async (req, res) => {
    let user = await users.findUser(username);
    res.render("profile", {data: user});
    // renders different file if user is accessing their own 
    //res.redirect("/users");
});
*/
router.put("/profile/:username", async (req, res) => {
    let user = await users.userSID(req.session.sessionID);
    res.render("infochange", {data: user});
    const userInfo = req.body;
    let theUser = await data.users.findUser(username);

  if (!userInfo) {
    res.status(400).json({ error: "You must provide data to update a user's info." });
    return;
  }

  try {
      if(userInfo.username != null)
        await data.users.changeUsername({_id: theUser._id}, userInfo.username);  
  } catch (e) {
      res.status(400).json({ error: "That name that is already taken. Please try something else." });
  }

  /*try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }*/

  try {
    if(userInfo.password != null)
        await data.users.changePassword({_id: theUser._id}, userInfo.password);
} catch (e) {
    res.status(400).json({ error: "You entered an invalid password. Please try something else." });
}

try {
    if(userInfo.firstName != null)
        await data.users.changeFirstName({_id: theUser._id}, userInfo.firstName);
} catch (e) {
    res.status(400).json({ error: "You entered an invalid first name. Please try something else." });
}

try {
    if(userInfo.lastName != null)
        await data.users.changeLastName({_id: theUser._id}, userInfo.lastName);
} catch (e) {
    res.status(400).json({ error: "You entered an invalid last name. Please try something else." });
}
});

router.get("/all", async (req,res) => {
   const allUsers = await data.users.getAllUsers();
   console.log(allUsers);
   res.render("login");
});

module.exports = router;
