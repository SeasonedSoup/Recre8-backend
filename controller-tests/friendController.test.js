const friendRouter = require('../routes/friendRoute');
const request = require('supertest');

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));

app.use('/', friendRouter);

/*test("Add Friend Works", done => {
    request(app)
        .post('/add')
})*/

test("placeholder test for friends", () => {
    expect(true).toBe(true);
});