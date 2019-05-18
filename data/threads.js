const mongoCollections = require("./collections");
const threads = mongoCollections.threads;
const users = require("./users");
const posts = require("./posts");
const uuid = require("node-uuid");
const mongo = require("mongodb");

async function createThread(username, title, forum, content) // a new thread should also create a new post
// maybe no content, and just have the content be part of the post that is subsequently created
{
    if (!user || typeof username != "string")
    {
        throw "You must provide a user for your thread in the form of a string.";
    }
    if (!title || typeof title != "string")
    {
        throw "You must provide a title for your thread in the form of a string.";
    }
    if (!content || typeof forum != "string")
    {
        throw "You must provide a forum for your thread in the form of a string.";
    }
    const threadCollection = await threads();

    let newThread = {
        username: username,
        title: title,
        forum: forum
    };

    const insertInfo = await threadCollection.insertOne(newThread);
    if (insertInfo.insertedCount === 0) 
    {
        throw "Could not create thread."
    }

    posts.addPost(username, content);

    const newId = insertInfo.insertedId;
    const thread = await this.getThreadById(newId);

    return thread;
}

async function getThreadById(id)
{
    if (!id) 
    {
        throw "You must provide an id to search for."
    }
    let userId;
    let username;

    const threadCollection = await threads();
    const thread = await threadCollection.findOne({ _id: mongo.ObjectId(id) });
    if (thread === null)
    {
        throw "No post exists with that id."
    }
    // the following section might have some errors:
    userId = thread.username;
    username = await users.getUserById(userId); // could be an issue with using the var name username again?
    thread.username = {_id: username._id, name: username.name}; // this might be messed up
    return post;
}

async function getThreadsByUser(username) { // maybe use user ID instead of name? not sure if it matters
    if (!username)
    {
        throw "You must provide a user to search for."
    }
    const threadCollection = await threads();
    const thread = await threadCollection.find({ username: String(username) }).toArray();
    if (thread === null)
    {
        throw "No threads exist by that user."
    }
    return thread;
}

/*async function getAllPosts() 
{
    const postCollection = await posts();
    const postsAll = await postCollection.find({}).toArray();
    let authorId;
    let authorName;

    for (let x = 0; x < postsAll.length; x++)
    {
        authorId = postsAll[x].author;
        authorName = await animals.get(authorId);
        postsAll[x].author = {_id: authorName._id, name: authorName.name};
    }
    return postsAll;
}*/

async function deleteThreadById(id) { // needs to also delete any posts that are in that thread
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    const threadCollection = await threads();
    const theThread = await this.getThreadById(id);
    const deletionInfo = await threadCollection.removeOne({ _id: mongo.ObjectId(id) });
    if (deletionInfo.deletedCount === 0) 
    {
        throw `Could not delete post with id of ${id}`;
    }
    let result = {"deleted": true, "data": theThread};
    return result;
}

/*async function emoveByAuthor(authorId) {
if (!authorId)
{
    throw "You must provide an id or string to search for";
}
const deletePosts = await this.getPostByAuthor(String(authorId));
for (let x = 0; x < deletePosts.length; x++) 
{
    await this.removeById(deletePosts[x]._id);
}
}*/

async function editThread(id, newTitle) {
if (!id)
{
    throw "You must provide an id to search for.";
}

if (!newTitle)
{
    throw "You must provide a new title for the thread.";
}

const threadCollection = await threads();
const postUpdate = {
    $set: { title: newTitle }
};

const updatedInfo = await threadCollection.updateOne({ _id: mongo.ObjectId(id) }, postUpdate);
if (updatedInfo.modifiedCount === 0) 
{
    throw "The thread title wasn't changed.";
}

return await this.getThreadById(id);
}

/*async function updateContent(id, newContent) {
    if (!id)
    {
    throw "You must provide an id to search for";
    }

    if (!newContent)
    {
    throw "You must provide new content for the post";
    }

    const postCollection = await posts();
    const postUpdate = {
        $set: { content: newContent }
    };
    
    const updatedInfo = await postCollection.updateOne({ _id: mongo.ObjectId(id) }, postUpdate);
    if (updatedInfo.modifiedCount === 0) 
    {
        throw "The post content wasn't changed";
    }

    return await this.getPostById(id);
}*/

async function getThreadsByForum (forumName) {

}

module.exports = {
    createThread,
    getThreadById,
    getThreadsByUser,
    deleteThreadById,
    editThread
}
