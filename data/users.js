const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const mongoCollections = require("./collections");
const users = mongoCollections.users;

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
        firstName: firstName,
        lastName: lastName,
        _id: uuid.v4(),
        sessionID: undefined
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
    const threads = require("./threads");
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
        const user = await userCollection.findOne({ _id: mongo.ObjectId(id) });
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
            throw "You must provide a username."
        }
        const userList = await users();
        for (let x = 0; x < userList.length; x++)
        {
            if (userList[x].sessionID === sessionID)
            {
                return userList[x];
            }
        }
        throw "The user could not be found.";
}

async function deleteUser(id)
{
    posts = require("./posts");
    if (!id) 
    {
        throw "You must provide an id to search for."
    }
    const userCollection = await users();
    const result = await this.get(mongo.ObjectId(id));
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
    const userCollection = await users();
    const updatedUser = {
        $set: {username: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: mongo.ObjectId(id) }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.get(id);
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
    const userCollection = await users();
    const updatedUser = {
        $set: {firstName: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: mongo.ObjectId(id) }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.get(id);
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
    const userCollection = await users();
    const updatedUser = {
        $set: {lastName: newName}
    };
    const updateInfo = await userCollection.updateOne({ _id: mongo.ObjectId(id) }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.get(id);
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
    const userCollection = await users();
    const updatedUser = {
        $set: {password: newPass}
    };
    const updateInfo = await userCollection.updateOne({ _id: mongo.ObjectId(id) }, updatedUser);
    if (updateInfo.modifiedCount === 0)
    {
        throw "The user does not exist and cannot be updated.";
    }
    return await this.get(id);
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
    findID,
    getAllPosts,
    getAllThreads,
    getUserById,
    userSID,
    deleteUser,
    changeUsername,
    changeFirstName,
    changeLastName,
    changePassword,
    createUser
};