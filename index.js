require('dotenv').config();

const express = require('express');
const app = express();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const cors = require('cors');
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use
app.get('/', (req, res) => {
    res.send("HI IM RECRE-8 API");
})

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`The server is now listening at http://localhost:${PORT}`);
})

