const tokenController = require('../controllers/tokenController');
const friendController = require('../controllers/friendController');

const {Router} = require('express');
const friendRouter = Router();

friendRouter.post('/add', tokenController.verifyToken, friendController.addFriend);
friendRouter.patch('/accept', tokenController.verifyToken, friendController.acceptFriend);
friendRouter.delete('/deleteFriend', tokenController.verifyToken, friendController.deleteFriend);
friendRouter.get('/friends', tokenController.verifyToken, friendController.getFriends);
module.exports = friendRouter;