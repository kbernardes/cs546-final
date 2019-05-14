const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const mongoCollections = require("./collections");
const users = mongoCollections.users;

const userList = [];

async function createUser(username, password, email, firstName, lastName)
{
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

    const userCollection = await users();

    let newUser = {
        username: username,
        password: password,
        email: email,
        firstName, firstName,
        lastName, lastName,
        _id: uuid.v4()
    };

    return userCollection.insertOne(newUser).then(newInsertInformation => 
        {
            return newInsertInformation.insertedId;
        })
        .then(newId => {
            return this.get(newId);
        });

    /*const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0)
    {
        throw "Could not add user.";
    }*/
}

async function findUser(username) {
    if (!username || typeof username != "string")
    {
        throw "You must provide a username."
    }
    for (let x = 0; x < userList.length; x++)
    {
        if (userList[x].username === username)
        {
            return userList[x];
        }
    }
    throw "The user could not be found.";
}

async function checkPass(user, password)
{
    if (!user || typeof user != "string")
    {
        throw "You must provide a user."
    }
    if (!password || typeof password != "string")
    {
        throw "You must provide a password."
    }
    try
    {
        var theUser = await findUser(user);
    }
    catch(e)
    {
        throw "The user could not be found.";
    }

    if (await bcrypt.compare(password, theUser.hashedPassword))
    {
        return true;
    }
    else
    {
        throw "The password was not correct.";
    }
}

async function findID(SID)
{
    for (let x = 0; x < userList.length; x++)
    {
        if (userList[x].SessionID === SID)
        {
            return userList[x];
        }
    }
    throw "The Session ID could not be found.";
}
module.exports = {
    findUser,
    checkPass,
    findID
};