const postController = require('../controllers/postController');
const imageController = require('../controllers/ImageController');
const tokenController = require('../controllers/tokenController');

const { Router } = require('express');
const postRouter = Router();

postRouter.post('/create-post', tokenController.verifyToken, imageController.uploadImage, postController.createPost);
postRouter.delete('/delete/:postId', tokenController.verifyToken, postController.deletePost);
postRouter.get('/posts', postController.getPosts);
postRouter.get('/your-posts', tokenController.verifyToken, postController.getUserPosts);
postRouter.get('/friend-posts', tokenController.verifyToken, postController.getFriendPosts);

module.exports = postRouter;
