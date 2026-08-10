const {prisma} = require('../lib/prisma');

const postRouter = require('../routes/postRoute');
const request = require('supertest');

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', postRouter);

const jwt = require('jsonwebtoken');

const postToken = jwt.sign(
    {userId: 3},
    process.env.JWT_SECRET,
    {expiresIn: '1h' }
);

beforeAll(async() => {
    await prisma.post.deleteMany();

    await prisma.user.upsert({
        where: {id: 3},
        create: { id: 3, email: 'posttest@test.com', username: 'postUser', password: 'hashed3' },
        update: {}
    });

    await prisma.post.upsert({
        where: {id: 1},
        create: { id: 1, title: "Test Post", content: 'this post is a test', authorId: 3},
        update: {}
    });
})

afterAll(async() => {
    await prisma.$disconnect();
})

test('Creating post works properly', done => {
    request(app)
    .post('/create-post')
    .set('Authorization', `Bearer ${postToken}`)
    .send({
        title: "My first post",  
        content: "I hope you like this post!"
    })
    .expect(201)
    .end((err, res) => {
        if (err) return done(err);
        
        expect(res.body.message).toBe("Post created successfully");
        done();
    })
})

test('Deleting post works well', done => {
    const postId = 1

    request(app)
    .delete(`/delete/${postId}`)
    .set('Authorization', `Bearer ${postToken}`)
    .expect(204)
    .end(done)
})

test("Fetches the first ten posts found", done => {
    request(app)
    .get('/posts')
    .expect(200)
    .end((err, res) => {
        if (err) return done(err);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);

        done();
    })
})