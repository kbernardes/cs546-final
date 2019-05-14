const bcrypt = require("bcrypt");

const userList = [];


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