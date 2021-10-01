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

module.exports = server;
