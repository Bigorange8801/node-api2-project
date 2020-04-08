const express = require("express");
const commentsRouter = require("./comments");
let db = require("../data/db");

const router = express.Router();

router.use("/:id/comments", commentsRouter);


router.get("/", (req, res) => {    
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})


router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

/
router.post("/", (req, res) => {
    if(!req.body.title || !req.body.contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post" })
    }

    db.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.log(error)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})


router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { title, contents } = req.body;
    
    if(!title || !contents) {
        res.status(404).json({ message: "Please provide title and contents for the post." })
    }

    try {
        const post = await db.findById(id)

        if(!post) {
            return res.status(404).json({ error: "The post with the specified ID does not exist" })
        }

        await db.update(id, { title, contents })
        res.status(200).json(post)
        
        } catch(err) {
            res.status(500).json({ error: "The post information could not be modified" })
    }
})


router.delete("/:id", (req, res) => {
    db.remove(req.params.id)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: "The post has been deleted succesfully" })
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
      })
  })

module.exports = router;