const tokenController = require('../controllers/tokenController');
const userController = require('../controllers/userController');

const passport = require('passport')
const {Router} = require('express');
const userRouter = Router();

//for login prob
userRouter.get('/get-user', tokenController.verifyToken, userController.getUser);
//local
userRouter.post('/login', passport.authenticate('local', {session: false,}), tokenController.signAndGiveToken);
userRouter.post('/sign-up', userController.signUp);

//github
userRouter.post('/github', passport.authenticate('github'), {session: false}, tokenController.signAndGiveToken);

//google 
userRouter.post('/google', passport.authenticate('google', {session: false}), tokenController.signAndGiveToken);
module.exports = userRouter;