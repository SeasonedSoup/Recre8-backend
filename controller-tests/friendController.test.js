const {prisma} = require('../lib/prisma')

const friendRouter = require('../routes/friendRoute');
const request = require('supertest');

const express = require("express");
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', friendRouter);

//test token for verification token controller
const testToken = jwt.sign(
        { userId: 1}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
)


beforeAll(async() => {
    await prisma.$transaction([
        prisma.friend.deleteMany()
    ]);

    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, email: 'test1@test.com', username: 'testuser1', password: 'hashed1' }
    });

    await prisma.user.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, email: 'test2@test.com', username: 'testuser2', password: 'hashed2' }
    });
})

afterAll(async() => {
    await prisma.$disconnect();
})

test("Add friend working", done => {
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

test("Accept friend working", done => {
    const aliceToken = jwt.sign(
        { userId: 2}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    )
    request(app)
    .patch('/accept')
    .set("Authorization", `Bearer ${aliceToken}`)
    .send({
        friendId: 1
    })
    .expect(200)
    .end((err, res) => { 
        if (err) return done (err)
        done()
    })
})

test("Bob is now friends with alice and should return an array of only 1 friend", done => {
    request(app).
    get("/friends")
    .set("Authorization", `Bearer ${testToken}`)
    .expect(200)
    .end((err, res) => {
        if (err) return done(err);
        
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(
            expect.arrayContaining([
            expect.objectContaining({username: 'testuser2'})
            ])
        )
            done();       
    })
})

//delete is for either denying a friendship or deleting it
test ("Delete friendship working for user1", done => {

    request(app)
    .delete('/deleteFriend')
    .set("Authorization", `Bearer ${testToken}`)
    .send({
        friendId: 2
    })
    .expect(200)
    .end((err, res) => {
        if (err) return done(err)
        done()
    }) 
})