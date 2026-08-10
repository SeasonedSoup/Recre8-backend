const postController = require('../controllers/postController');
const tokenController = require('../controllers/tokenController');

const {Router} = require('express');
const postRouter = Router();

postRouter.post('/create-post', tokenController.verifyToken, postController.createPost);
postRouter.delete('/delete/:postId', tokenController.verifyToken, postController.deletePost);
postRouter.get('/posts', postController.getPosts);
module.exports = postRouter;