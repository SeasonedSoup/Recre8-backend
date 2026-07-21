const userRouter = require('../controllers/userController');
const request = require('supertest');

const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use('/', userRouter);

test("User is able to sign up", done => {
    request(app)
        .post('/sign-up')
});