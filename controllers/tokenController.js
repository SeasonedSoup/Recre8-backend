const jwt = require ("jsonwebtoken");
require("dotenv").config();

async function signAndGiveToken(req, res) {
    const user = req.user
    const token = jwt.sign({userId: req.user.id}, process.env.JWT_SECRET, 
        {expiresIn: '7d'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    })

    //oauth
    if (req.method === 'GET') {
        return res.redirect(`http://localhost:5173/auth-success`)
    }

    //local
    res.json({user});
}

async function verifyToken(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(403).json({message: "Access Denied Please Log In"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({message: "Invalid or Expired Token"});
    }
}

async function removeToken(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'lax',
        path: '/'
    });

    res.json({message: "Logged Out Successfully"})
}
/* old via headers
async function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader == null) return res.status(403).json({message: "No Token Found"});
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({message: "Invalid or Expired Token"});
    }
}
    */

module.exports = {
    signAndGiveToken,
    verifyToken,
    removeToken
}