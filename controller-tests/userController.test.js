const {prisma} = require('../lib/prisma');
const userRouter = require('../routes/userRoute');
const request = require('supertest');

const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', userRouter);

beforeEach(async() => {
    await prisma.$transaction([
        prisma.user.deleteMany()
    ]);
})

afterAll(async() => {
    await prisma.$disconnect();
})
test("User is able to sign up", done => {
    request(app)
        .post('/sign-up')
        .send({
            username: 'Bob',
            password: 'coolguy12',
            email: "bob@gmail.com"
        })
        .expect(201)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).toBe("User successfully created")

            done();
        })
});