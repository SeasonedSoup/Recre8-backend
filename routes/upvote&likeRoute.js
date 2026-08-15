const upvoteLikeController = require('../controllers/Upvote&LikeController');
const tokenController = require('../controllers/tokenController');

const {Router} = require('express');
const upvoteLikeRouter = Router();

upvoteLikeRouter.post('/likePost', tokenController.verifyToken, upvoteLikeController.toggleLike);
upvoteLikeRouter.post('/upvoteComment', tokenController.verifyToken, upvoteLikeController.toggleUpvote);

module.exports = upvoteLikeRouter;