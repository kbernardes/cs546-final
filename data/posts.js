const mongoCollections = require("./collections");
const posts = mongoCollections.posts;
const users = require("./users");
const uuid = require("node-uuid");
const mongo = require("mongodb");

let forums = [
    {
        title: "Mafia Game Signups",
        url: "mafia-game-signups",
        threads: []    
    },
    {
        title: "Ongoing Games",
        url: "ongoing-games",
        threads: []
    },
    {
        title: "Game Discussion",
        url: "game-discussion",
        threads: []
    },
    {
        title: "General Discussion",
        url: "general-discussion",
        threads: []
    }
]

async function addPost(username, content) 
{
    if (!user || typeof username != "string")
    {
        throw "You must provide a user for your post in the form of a string.";
    }
    if (!content || typeof content != "string")
    {
        throw "You must provide content for your post in the form of a string.";
    }
    const postCollection = await posts();

    let newPost = {
        username: username,
        content: content,
        thread: thread
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) 
    {
        throw "Could not add post"
    }

    const newId = insertInfo.insertedId;
    const post = await this.getPostById(newId);

    return post;
}

async function getPostById(id)
{
    if (!id) 
    {
        throw "You must provide an id to search for."
    }
    let userId;
    let username;

    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: mongo.ObjectId(id) });
    if (post === null)
    {
        throw "No post exists with that id."
    }
    authorId = post.username;
    username = await users.getUserById(userId);
    post.username = {_id: username._id, name: username.name};
    return post;
}

async function getPostsByUser(username) {
    if (!username)
    {
        throw "You must provide a user to search for."
    }
    const postCollection = await posts();
    const post = await postCollection.find({ username: String(username) }).toArray();
    if (post === null)
    {
        throw "No posts exist by that user."
    }
    return post;
}
async function getPostsByThread(thread) {
    if (!thread)
    {
        throw "You must provide a thread to search for."
    }
    const postCollection = await posts();
    const post = await postCollection.find({ thread: String(thread) }).toArray();
    if (post === null)
    {
        throw "This thread is empty."
    }
    return post;
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

async function deletePostById(id) {
    if (!id)
    {
        throw "You must provide an id to search for.";
    }
    const postCollection = await posts();
    const thePost = await this.getPostById(id);
    const deletionInfo = await postCollection.removeOne({ _id: mongo.ObjectId(id) });
    if (deletionInfo.deletedCount === 0) 
    {
        throw `Could not delete post with id of ${id}`;
    }
    let result = {"deleted": true, "data": thePost};
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

async function editPost(id, newContent) {
if (!id)
{
    throw "You must provide an id to search for.";
}

if (!newContent)
{
    throw "You must provide new content for the post.";
}

const postCollection = await posts();
const postUpdate = {
    $set: { content: newContent }
};

const updatedInfo = await postCollection.updateOne({ _id: mongo.ObjectId(id) }, postUpdate);
if (updatedInfo.modifiedCount === 0) 
{
    throw "The post content wasn't changed.";
}

return await this.getPostById(id);
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

async function getForumByURL (url) {
    for (let i = 0; i < forums.length; i++) {
        if (url === forums[i].url) {
            return forums[i];
        }
    }
    return false;
}

module.exports = {
    addPost,
    getPostById,
    getPostsByUser,
    getPostsByThread,
    deletePostById,
    editPost,
    forums,
    getForumByURL
}
