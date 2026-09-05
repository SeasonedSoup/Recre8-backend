const tokenController = require('../controllers/tokenController');
const userController = require('../controllers/userController');

const passport = require('passport')
const {Router} = require('express');
const userRouter = Router();

//for login prob
userRouter.get('/get-user', tokenController.verifyToken, userController.getUser);

//users
userRouter.get('/users', tokenController.verifyToken, userController.getAllUsers);

// PASSPORT STRATEGIES
//local
userRouter.post('/login', passport.authenticate('local', {session: false,}), tokenController.signAndGiveToken);
userRouter.post('/sign-up', userController.signUp);

userRouter.post('/logout', tokenController.removeToken);

//github
userRouter.get('/github', passport.authenticate('github', {session: false, scope:["user:email"]}));
userRouter.get('/github/callback', passport.authenticate('github', {session: false}), tokenController.signAndGiveToken);
//google 
userRouter.get('/google', passport.authenticate('google', {session: false, scope:['profile', 'email']}));
userRouter.get('/google/callback', passport.authenticate('google', {session: false}), tokenController.signAndGiveToken);

module.exports = userRouter;