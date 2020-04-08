const express = require("express");
const commentsRouter = require("./comments");
let db = require("../data/db");

const router = express.Router();

router.use("/:id/comments", commentsRouter);

// ### Blog Post Schema

// A Blog Post in the database has the following structure:

// ```js
// {
//   title: "The post title", // String, required
//   contents: "The post contents", // String, required
//   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
// }
// ```

// get (/api/posts) returns an array of all the post objects
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

// get (/api/posts/:id) returns the post object with the specified id
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

// post (/api/posts) creates a post using the info sent inside the request body
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

// put (/api/posts/:id) updates the post with the specified id using data from the request body. 
// Returns modified document, not the original.
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

// delete (/api/posts/:id) removes the post with the specified id and returns the deleted post object
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