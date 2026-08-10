const commentController = require('../controllers/commentController');
const tokenController = require('../controllers/tokenController');
const {Router} = require('express');

const commentRouter = Router();

commentRouter.post('/create-comment', tokenController.verifyToken, commentController.commentOnPost);
commentRouter.delete('/:commentId/delete-comment', tokenController.verifyToken, commentController.deleteCommentById);
commentRouter.get('/:postId/comments', commentController.getCommentsOnPost)

module.exports = commentRouter;