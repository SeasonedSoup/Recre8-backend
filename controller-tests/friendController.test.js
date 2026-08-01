const {prisma} = require('../lib/prisma')

const friendRouter = require('../routes/friendRoute');
const request = require('supertest');

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', friendRouter);

beforeEach(async() => {
    await prisma.$transaction([
        prisma.friend.deleteMany()
    ]);
})

afterAll(async() => {
    await prisma.$disconnect();
})
test("Add friend working", done => {
    request(app).
    post('/add').
    send({
        userId : 1,
        friendId : 2
    })
    .expect(200)
    .end((err, res) => {
        if (err) return done (err)
        done()
    })
});