const {prisma} = require('../lib/prisma');
const upvoteLikeRouter = require('../routes/upvote&likeRoute');

const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.json)
app.use(express.urlencoded({extended: false}));
app.use('/', upvoteLikeRouter);

const jwt = require('jsonwebtoken');

beforeAll(async() => {
    await prisma.user.upsert({
        where: {id: 5},
        create: {id: 5, email: "upvote&like@gmail.com", username: "UserUpvoterLiker", password: "hashed5"},
        update: {}
        }
    )

    await prisma.post.upsert({
        
    })
})
afterAll(async() => {
    await prisma.$disconnect();
})

test("Liking on a post works successfully" , done => {
    request(app)
})

test("Upvoting on a post works successfully", done => {

})