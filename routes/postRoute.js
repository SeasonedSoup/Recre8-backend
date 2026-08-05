const postController = require('../controllers/postController');
const tokenController = require('../controllers/tokenController');

const {Router} = require('express');
const postRouter = Router();

postRouter.post('/create-post', tokenController.verifyToken, postController.createPost);

module.exports = postRouter;