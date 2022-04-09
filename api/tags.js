const express = require('express');
const tagsRouter = express.Router();
const {getAllTags, getPostsByTagName} = require('../db');

tagsRouter.use((req,res,next) => {
    console.log("A request has been made for ./tags");
    next();
});

tagsRouter.get('/',async(req,res) => {
    const tags = await getAllTags();
    res.send({
            tags
        }
    );
});

tagsRouter.get('/:tagName/posts',async(req,res,next) => {
    const {tagName} = req.params;
    try {
        const postsByTagName = await getPostsByTagName(tagName);
        const posts = postsByTagName.filter(post => {
            // keep a post if it is either active, or if it belongs to the current user
            return post.author.active || post.active || (req.user && post.author.id === req.user.id);
          });
    res.send({
        posts
    });
} catch ({name,message}) {
    next({ name, message });
    }
})

module.exports = tagsRouter;