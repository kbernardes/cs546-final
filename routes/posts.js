const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/:id", async (req, res) => {
  try {
    const posts = await postData.getPostById(req.params.id);
    res.json(posts);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const postList = await postData.getAllPosts();
    res.json(postList);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const postInfo = req.body;

  if (!postInfo) {
    res.status(400).json({ error: "You must provide data to create a post" });
    return;
  }

  if (!postInfo.title) {
    res.status(400).json({ error: "You must provide a title for the post" });
    return;
  }

  if (!postInfo.author) {
    res.status(400).json({ error: "You must provide an author for the post" });
    return;
  }

  if (!postInfo.content) {
    res.status(400).json({ error: "You must provide content for the post" });
    return;
  }

  try {
    const newPost = await postData.addPost(
      postInfo.title,
      postInfo.author,
      postInfo.content
    );
    res.json(newPost);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  const postInfo = req.body;

  if (!postInfo) {
    res.status(400).json({ error: "You must provide data to update a post" });
    return;
  }

  if (!postInfo.newTitle && !postInfo.newContent) {
    res.status(400).json({ error: "You must provide a title and/or content for the post" });
    return;
  }

  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (!postInfo.newTitle)
  {
    try {
        const updatedPost = await postData.updateContent(req.params.id, postInfo.newContent);
        res.json(updatedPost);
      } catch (e) {
        res.sendStatus(500);
      }
  }

  else if (!postInfo.newContent)
  {
    try {
        const updatedPost = await postData.updateTitle(req.params.id, postInfo.newTitle);
        res.json(updatedPost);
      } catch (e) {
        res.sendStatus(500);
      }
  }

  else
  {
    try {
        await postData.updateTitle(req.params.id, postInfo.newTitle);
      } catch (e) {
        res.sendStatus(500);
      }

    try {
        const updatedPost = await postData.updateContent(req.params.id, postInfo.newContent);
        res.json(updatedPost);
        } catch (e) {
        res.sendStatus(500);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  try {
    const post = await postData.removeById(req.params.id);
    res.json(post)
  } catch (e) {
    res.sendStatus(500);
    return;
  }
});

module.exports = router;
