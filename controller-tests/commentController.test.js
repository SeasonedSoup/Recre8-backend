const {prisma} = require('../lib/prisma');
const commentRouter = require('../routes/commentRoute');

const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/', commentRouter);

const jwt = require('jsonwebtoken');
const commentToken = jwt.sign(
    {userId: 4},
    process.env.JWT_SECRET,
    {expiresIn: '1h'}
) ;


beforeAll(async() => {
    await prisma.comment.deleteMany();

    await prisma.user.upsert({
        where: {id: 4},
        create: {id: 4, email: "comment@gmail.com", username: "UserCommenter", password: "hashed4"},
        update: {}
    })

    await prisma.post.upsert({
        where: {id: 2},
        create: { id: 2, title: "Comment Post", content: 'this post is a test for commenting', authorId: 4},
        update: {}
    });
})

afterAll(async() => {
    await prisma.$disconnect();
})

const request = require("supertest");

test("Create comment on post successfully", done => {
    request(app)
    .post('/create-comment')
    .set("Authorization", `Bearer ${commentToken}`)
    .send({
        postId: 2,
        comment: "I commented on my own post!",
    })
    .expect(201)
    .end((err, res) => {
        if (err) return done(err);

        expect(res.body.message).toBe("Comment successfully submitted on post");

        done();
    })
})

