require('dotenv').config();

const express = require('express');
const app = express();
const Auth = require('./lib/auth')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {prisma} = require('./lib/prisma');
const bcryptjs = require('bcryptjs');

// Local strategy
passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            })

            if (!user) {
                return done(null, false, {message: "Username does not exist"});
            }

            const match = await bcryptjs.compare(passport, user.password);

            if (!match) {
                return done(null, false, {message: "Incorrect password"})
            }

            return done(null, user)

        } catch (err) {
            return done(err)
        }
    }))
// GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await Auth.GithubAuth(profile);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
  }
));

//Google Strategy 
passport.use(new GoogleStrategy({
    clientID: procces.env.GOOGLE_CLIENT_ID,
    clientSecret: proccess.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await Auth.GoogleAuth(profile);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
  }
));

app.use(passport.initialize());

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

