const tokenController = require('../controllers/tokenController');
const friendController = require('../controllers/friendController');

const {Router} = require('express');
const friendRouter = Router();

friendRouter.post('/add', tokenController.verifyToken, friendController.addFriend);
friendRouter.get('/get-user', tokenController.signAndGiveToken)
module.exports = friendRouter;