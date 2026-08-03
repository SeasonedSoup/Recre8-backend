require('dotenv').config()
const {prisma} = require('../lib/prisma')

const friendRouter = require('../routes/friendRoute');
const request = require('supertest');

const express = require("express");
const app = express();

const jwt = require('jsonwebtoken');

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
    const testToken = jwt.sign(
        { id: 1, email: "test@example.com" }, 
        process.env.JWT_SECRET || 'your_test_secret', 
        { expiresIn: '1h' }
    )

    request(app).
    post('/add').
    set("Authorization", `Bearer ${testToken}`).
    send({
        userId : 1,
        friendId : 2
    })
    .end((err, res) => {
         if (res.status === 500) {
                console.log("SERVER ERROR BODY:", res.body); // <-- This prints your backend error
            }
        if (err) return done (err)
        done()
    })
});