const express = require("express")
let db = require("../data/db");

const router = express.Router({
    mergeParams: true
})



router.get("/", (req, res) => {
    const id = req.params.id;

    db.findPostComments(id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({ error: "The post with the specified ID does not exist." })
        })
})



router.get("/:commentId", (req, res) => {
    db.findCommentById(req.params.id, req.params.commentId)
        .then(data => {
            if(data) {
                res.json(data)
            } else {
                res.status(404).json({
                    message: "Comment not found"    
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not retrieve comment"
            })
        })
})



router.post("/", (req, res) => {
    const comment = req.body;
    const id = req.params.id;
    console.log(comment)

    if (!comment.text) {
      res.status(400).json({ errorMessage: 'Please provide text for the comment.'})
    } else {

        const newComment = {
            text: req.body.text,
            post_id: id
        }

      db.insertComment(newComment)
      .then(comment => {
        if (comment) {
          res.status(201).json(newComment)
        } else {
          res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage: 'There was an error while saving the comment to the database'
        })
      })
    }
  })

module.exports = router;