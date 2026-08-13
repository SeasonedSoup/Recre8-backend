const {prisma} = require('../lib/prisma');
const upvoteLikeRouter = require('../routes/upvote&likeRoute');

const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/', upvoteLikeRouter);

const jwt = require('jsonwebtoken');

const upvoteLikeToken = jwt.sign(
    {userId: 5},
    process.env.JWT_SECRET, 
    {expiresIn: "1h"}
);

beforeAll(async() => {
    await prisma.user.upsert({
        where: {id: 5},
        create: {id: 5, email: "upvote&like@gmail.com", username: "UserUpvoterLiker", password: "hashed5"},
        update: {}
        }
    )

    await prisma.post.upsert({
        where: {id: 3},
        create: {id: 3, title: "The post that will be liked", content: "This post will be liked by myself", authorId: 5},
        update: {}
    });

    await prisma.comment.upsert({
        where: {id: 2},
        create: {id: 2, text: "My comment will be upvoted", commenterId: 5, postId: 3},
        update: {}
    })
})
afterAll(async() => {
    await prisma.$disconnect();
})

test("Liking on a post works successfully" , done => {
    request(app).
    post('/likePost')
    .set("Authorization", `Bearer ${upvoteLikeToken}`)
    .send({
        postId: 3
    })
    .expect(200)
    .end((err, res) => {
        if (err) return done(err)

        done()
    })
})

test("Upvoting on a post works successfully", done => {
    expect(true).toBe(true)

    request(app).
    post('/upvoteComment')
    .set("Authorization", `Bearer ${upvoteLikeToken}`)
    .send({
        commentId: 2
    })
    .expect(200)
    .end((err, res) => {
        if (err) return done(err)

        done()
    })
})