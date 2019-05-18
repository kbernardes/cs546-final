const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const threadData = data.threads;

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
    const threads = await threadData.getThreadsByForum(req.params.forumName);
    res.render("forum", {forums: postData.forums, threads: threads})
  } catch (e) {
    res.status(404).json({ error: "Threads not found." });
  }
})

router.get("/:forumName/:threadId", async (req, res) => { // access a thread
  try {
    const threads = await threadData.getThreadById(req.params.threadId);
    res.json(threads);
  } catch (e) {
    res.status(404).json({ error: "Thread not found." });
  }
});

router.post("/:forumName/:threadId", async (req, res) => {
  const threadInfo = req.body;

  if (!threadInfo) {
    res.status(400).json({ error: "You must provide data to create a thread." });
    return;
  }

  if (!threadInfo.title) {
    res.status(400).json({ error: "You must provide a title for the thread." });
    return;
  }

  if (!postInfo.forum) {
    res.status(400).json({ error: "You must specify which forum to make the post in." });
    return;
  }

  try {
    const newThread = await threadData.createThread(
      threadInfo.username,
      threadInfo.title,
      threadInfo.forum,
      threadInfo.content
    );
    res.json(newThread);
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
