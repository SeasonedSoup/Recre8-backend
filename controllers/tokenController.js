const jwt = require ("jsonwebtoken");
require("dotenv").config();

async function signAndGiveToken(req, res) {
    const user = req.user
    jwt.sign({userId: req.user.id}, process.env.JWT_SECRET, 
        {expiresIn: '7d'}, (err, token) => {
            if (err) {
                return res.status(401).json({error: "Error in processing the token has occured"})
            }
            res.json({token, user})
        }
     )
}

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
        throw err;
    }
}

module.exports = {
    signAndGiveToken,
    verifyToken
}