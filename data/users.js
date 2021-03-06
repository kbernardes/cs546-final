const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const mongoCollections = require("./collections");
const users = mongoCollections.users;
const uuid = require("node-uuid");
const threads = require("./threads");

async function createUser(username, password, email, firstName, lastName)
{
    console.log("here");
    if (!username || typeof username != "string")
    {
        throw "You must provide a username.";
    }
    if (!password || typeof password != "string")
    {
        throw "You must provide a password.";
    }
    if (!email || typeof email != "string")
    {
        throw "You must provide an email.";
    }
    if (!firstName || typeof firstName != "string")
    {
        throw "You must provide a first name.";
    }
    if (!lastName || typeof lastName != "string")
    {
        throw "You must provide a last name.";
    }
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.findUser(username);
    console.log(user);

    if (user) {
        return false;
    }

    return users().then(userCollection => {
        let newUser = {
            username: username,
            hashedPassword: hashedPassword,
            email: email,
            firstName: firstName,
            lastName: lastName,
            _id: uuid.v4(),
            sessionID: undefined
        };
  
        return userCollection
          .insertOne(newUser)
          .then(newInsertInformation => {
            return newInsertInformation.insertedId;
          })
          .then(newId => {
            return this.findID(newId);
          });
      });

/*
    const newId = uuid.v4();

    let newUser = {
        username: username,
        hashedPassword: hashedPassword,
        email: email,
        firstName: firstName,
        lastName: lastName,
        _id: newId,
        sessionID: undefined
    };
    return userCollection.insertOne(newUser).then(newInsertInformation => 
        {
            return newInsertInformation.insertedId;
        })
        .then(newId => {
            return this.getUserById(newId);
        });
*/
    /*const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0)
    {
        throw "Could not add user.";
    }*/
}

async function getAllUsers() 
{
    const userCollection = await users();
    const usersAll = await userCollection.find({}).toArray();
    return usersAll;
}

async function getAllPosts() 
{
    const userCollection = await users();
    const posts = require("./posts");
    const usersAll = await userCollection.find({}).toArray();
    let userPosts = [];

    for (let x = 0; x < usersAll.length; x++)
    {
        userPosts = await posts.getPostByUser(usersAll[x]._id);
        usersAll[x].posts = [];
        for (let y = 0; y < userPosts.length; y++)
        {
            usersAll[x].posts.push({_id: userPosts[y]._id, title: userPosts[y].title})
        }
    }
    return usersAll;
}

async function getAllThreads() 
{
    const userCollection = await users();
    const usersAll = await userCollection.find({}).toArray();
    let userThreads = [];

    for (let x = 0; x < usersAll.length; x++)
    {
        userThreads = await threads.getThreadByUser(usersAll[x]._id);
        usersAll[x].threads = [];
        for (let y = 0; y < userThreads.length; y++)
        {
            usersAll[x].threads.push({_id: userThreads[y]._id, title: userThreads[y].title})
        }
    }
    return usersAll;
}

async function getUserById(id)
{
    if (!id) 
    {
        throw "You must provide an id to search for."
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    if (user === null)
    {
        throw "No user exists with that id."
    }
    return user;
}

async function userSID(sessionID)
{
    if (!sessionID || typeof sessionID != "string")
    {
        return false;
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ sessionID: sessionID });
    //console.log("User with SID: " + user);
    if (!user) {
        return false;
    }
    return user;
}

async function deleteUser(id)
{
    posts = require("./posts");
    if (!id) 
    {
        throw "You must provide an id to search for."
    }
    const userCollection = await users();
    const result = await this.findID(id);
    await posts.removeByUser(id);
    const deleteUser = await userCollection.removeOne(result);
    if (deleteUser.deletedCount === 0)
    {
        throw `Could not delete animal with id of ${id}.`
    }
    else
    {
        let real = {
            deleted: true,
            data: result
        };
        return real;
    }
}

async function changeUsername(id, newName)
{
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    if (!newName)
    {
        throw "You must provide a new name to change to.";
    }
    if (newName === "")
    {
        throw "Your username cannot be empty."
    }
    if (await findUser(newName) !== false)
    {
        throw "The username already exists. Please select a different one."
    }
    const userCollection = await users();
    const updatedUser = {
        $set: {username: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function changeFirstName(id, newName)
{
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    if (!newName)
    {
        throw "You must provide a new name to change to.";
    }
    if (newName === "")
    {
        throw "Your first name cannot be empty."
    }
    const userCollection = await users();
    const updatedUser = {
        $set: {firstName: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function changeLastName(id, newName)
{
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    if (!newName)
    {
        throw "You must provide a new name to change to.";
    }
    if (newName === "")
    {
        throw "Your last name cannot be empty."
    }
    const userCollection = await users();
    const updatedUser = {
        $set: {lastName: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function changePassword(id, newPass)
{
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    if (!newPass)
    {
        throw "You must provide a new name to change to.";
    }
    if (newPass === "")
    {
        throw "Your password cannot be empty."
    }
    const userCollection = await users();
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedUser = {
        $set: {hashedPassword: hashedPassword}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function updateSID(id, sid){
    const userCollection = await users();
    if (!id)
    {
        throw "You must provide an id."
    }
    if (!sid)
        throw 'need new sid'

    const updatedUser = {
        $set: {sessionID: sid}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function endSID(id){
    const userCollection = await users();
    if (!id)
    {
        throw "You must provide an id."
    }
    const newSession = undefined;
    const updatedUser = {
        $set: {sessionID: newSession}
    };
    const updateInfo = await userCollection.updateOne({ _id: id }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.findID(id);
}

async function findUser(username) {
    
    const userCollection = await users();
    if (!username || typeof username != "string")
    {
        throw "You must provide a username."
    }
    try{
    const user = await userCollection.findOne({ username: username })
    if (user === null) {
        console.log("fail1");
        return false;
    }
    return user;
    }
    catch(e){
        throw "Can't find user";
    }
}

async function checkPass(username, password)
{
    if (!username || typeof username != "string")
    {
        console.log('no user');
        throw "You must provide a user."
    }
    if (!password || typeof password != "string")
    {
        console.log('no pass');
        throw "You must provide a password."
    }
    try
    {
        var theUser = await findUser(username);
    }
    catch(e)
    {
        console.log("The user could not be found.");
    }

    if (await bcrypt.compare(password, theUser.hashedPassword))
    {
        console.log('password good');
        return true;
    }
    else
    {
        console.log('password not right');
        throw "The password was not correct.";
    }
}

async function findID(id)
{
    const userCollection = await users();
    
    if (!id || typeof id != "string")
    {
        throw "You must provide a id."
    }
    const user = await userCollection.findOne({ _id: id })
    if (user === null) {
        console.log("fail1");
        return false;
    }
    return user;
}
module.exports = {
    findUser,
    checkPass,
    findID,
    getAllPosts,
    getAllThreads,
    getUserById,
    userSID,
    updateSID,
    endSID,
    deleteUser,
    changeUsername,
    changeFirstName,
    changeLastName,
    changePassword,
    createUser,
    getAllUsers
};