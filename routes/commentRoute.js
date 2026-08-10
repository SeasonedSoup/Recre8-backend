const commentController = require('../controllers/commentController');
const tokenController = require('../controllers/tokenController');
const {Router} = require('express');

const commentRouter = Router();

commentRouter.post('/create-comment', tokenController.verifyToken, commentController.commentOnPost);


module.exports = commentRouter;