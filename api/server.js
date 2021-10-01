// implement your server here
// require your posts router and connect it here
const express = require("express");
const server = express();
const Post = require("./posts/posts-model");

server.use(express.json());

server.get("/api/posts", (req, res) => {
  Post.find()
    .then((post) => {
      console.log(post);
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
      });
    });
});

server.get("/api/posts/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post
        ? res.status(200).json(post)
        : res.status(404).json({
            message: "The post with the specified ID does not exist",
          });
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
        err: err.message,
      });
    });
});

server.post("/api/posts", (req, res) => {
  const newPost = req.body;
  !newPost.title || !newPost.contents
    ? res.status(400).json({
        message: "Please provide title and contents for the post",
      })
    : Post.insert(newPost)
        .then(({ id }) => {
          return Post.findById(id);
        })
        .then((posts) => {
          res.status(201).json(posts);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "There was an error while saving the post to the database",
            error: error.message,
            stack: error.stack,
          });
        });
});

server.put("/api/posts/:id", async (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  const post = await Post.findById(id);
  try {
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else if (!changes.title || !changes.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      await Post.update(id, changes);

      res.status(200).json({
        id: parseInt(id),
        title: changes.title,
        contents: changes.contents,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

server.delete("/api/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.params.id);
    if (!deletedPost) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      Post.remove(req.params.id).then(() => {
        res.status(200).json(deletedPost);
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
    });
  }
});

module.exports = server;
