const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const threadData = data.threads;
const userData = data.users;

async function authTest(req) {
  if ((req.session.sessionID === undefined) || (!req.session.sessionID) || (req.session.sessionID !== (await data.users.userSID(req.session.sessionID)).sessionID)) {
    return false;
} 
  else
    return true;
}

router.get("/", async (req, res) => {
  if (await authTest(req)) {
      res.render("loggedin-frontpage", {user: await data.users.userSID(req.session.sessionID), forums: data.posts.forums});
  }
  else {
      res.render("frontpage", {forums: data.posts.forums});
  }
});

router.get("/:forumName", async (req, res) => {
  try {
    const forum = await postData.getForumByURL(req.params.forumName);
    const threads = await threadData.getThreadsByForum(forum.title);
    res.render("forum", {forum: forum, threads: threads})
  } catch (e) {
    res.status(404).json({ error: "Threads not found." });
  }
});

router.get("/:forumName/new-thread", async (req, res) => { // access a thread
  if (await authTest(req)) {
    res.render("newthread", {forum: await postData.getForumByURL(req.params.forumName)});
  }
  else {
      res.render("login");
  }
});

router.post("/:forumName/new-thread", async (req, res) => {
  if (await authTest(req)) {

    const forum = await postData.getForumByURL(req.params.forumName);
    const title = req.body.title;
    const author = await userData.userSID(req.session.sessionID);
    const newThread = await threadData.createThread(author.username, title, forum.title, req.body.content);

    res.redirect("/forums/" + forum.url + "/" + newThread._id);
  }
  else {
      res.render("login");
  }
});

router.get("/:forumName/:threadId", async (req, res) => { // access a thread
  try {
    const thread = await threadData.getThreadById(req.params.threadId);
    let postArray = [];
    let authorArray = [];
    for (let i = 0; i < thread.posts.length; i++) {
      postArray[i] = await postData.getPostById(thread.posts[i]);
      authorArray[i] = await userData.findUser(postArray[i].username);
    }

    res.render("thread", {thread: thread, posts: postArray, author: authorArray});
  } catch (e) {
    res.status(404).json({ error: "Thread not found." });
  }
});

router.post("/:forumName/:threadId", async (req, res) => {
  const content = req.body.content;

  if (!content) {
    res.status(400).json({ error: "You must provide data to create a post." });
    return;
  }

  try {
    const newThread = await postData.addPost(await userData.userSID(req.session.sessionID), content, req.params.threadId);
    res.redirect("/forums/" + req.params.forumName + "/" + req.params.threadId);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put("/:forumName/:threadId", async (req, res) => {
  const threadInfo = req.body;

  if (!threadInfo) {
    res.status(400).json({ error: "You must provide data to update a thread title." });
    return;
  }

  try {
    await threadData.editThread(req.params.id, threadInfo.newTitle);
  } catch (e) {
    res.status(404).json({ error: "Thread not found." });
    return;
  }
});

router.delete("/:forumName/:threadId", async (req, res) => {
  try {
    await threadData.getThreadById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Thread not found." });
    return;
  }

  try {
    const thread = await threadData.deleteThreadById(req.params.id);
    res.json(thread)
  } catch (e) {
    res.sendStatus(500);
    return;
  }
});

/*router.get("/:forumName/:threadId", async (req, res) => { // access a thread
  try {
    const threads = await threadData.getThreadById(req.params.id);
    res.json(threads);
  } catch (e) {
    res.status(404).json({ error: "Thread not found." });
  }
});


try {
  const updatedPost = await postData.updateContent(req.params.id, postInfo.newContent);
  res.json(updatedPost);
  } catch (e) {
  res.sendStatus(500);
}*/

module.exports = router;
