const upvoteLikeController = require('../controllers/Upvote&LikeController');
const tokenController = require('../controllers/tokenController');

const {Router} = require('express');
const upvoteLikeRouter = Router();

upvoteLikeRouter.post('/postLike', tokenController.verifyToken, upvoteLikeController.toggleLike);
upvoteLikeRouter.post('/commentUpvote', tokenController.verifyToken, upvoteLikeController.toggleUpvote);

module.exports = upvoteLikeRouter;