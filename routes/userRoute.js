const tokenController = require('../controllers/tokenController');
const userController = require('../controllers/userController');

const {Router} = require('express');
const userRouter = Router();

userRouter.post('/sign-up', userController.signUp);
friendRouter.get('/get-user', tokenController.verifyToken, userController.getUser);
module.exports = userRouter;