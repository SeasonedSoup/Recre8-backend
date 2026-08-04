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

    await prisma.user.createMany({
        data: [
            {
                id: 1, 
                email: 'test1@test.com', 
                username: 'testuser1',
                password: 'hashed1' 
            },
            {
                id: 2, 
                email: 'test2@test.com', 
                username: 'testuser2',
                password: 'hashed2' 
            }
        ],
        skipDuplicates: true
    })
})

afterAll(async() => {
    await prisma.$disconnect();
})

test("Add friend working", done => {
    const testToken = jwt.sign(
        { userId: 1}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    )

    request(app).
    post('/add').
    set("Authorization", `Bearer ${testToken}`).
    send({
        friendId : 2
    })
    .expect(200)
    .end((err, res) => { 
        if (err) return done (err)
        done()
    })
});