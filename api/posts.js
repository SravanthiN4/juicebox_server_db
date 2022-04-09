const express = require('express');
const postsRouter = express.Router();
const {getAllPosts, createPost} = require('../db')
const {requireUser} = require('./util')

postsRouter.use((req,res,next) => {
    console.log("A request has been made for ./posts");
    next();
});

postsRouter.get('/',async(req,res) => {
    const posts = await getAllPosts();
    res.send({
        posts
    });

});

postsRouter.post('/',requireUser, async(req,res,next) => {
    const {title, content, tags = ""} = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData  = {};
    // only send the tags if there are some to send
    if(tagArr.length) {
        postData.tags = tagArr;
    }
    try {
        postData.authorId = req.user.id
        postData.title = title
        postData.content = content

        if(postData.length !== 0) {
        const post = await createPost(postData);
        console.log(post);
        
        res.send({ post })
        }

        else{

        next({ 
            name: 'PostNotAvailable', 
            message: 'Post is not created'
          });
        }
        
    } catch ({ name, message }) {
        next({ name, message });
      }
    
})

module.exports = postsRouter;