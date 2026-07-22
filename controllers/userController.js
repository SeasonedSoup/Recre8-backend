const {prisma} = require('../lib/prisma');
const bcryptjs = require('bcryptjs');

const signUp = async(req, res) => {
    const {username, password, email, } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({error: "Username and password cannot be empty"});
    }
    const hashedPassword = await bcryptjs.hash(req.body.password, 11);
    
    const result = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            email: email
        }
    })

    const {password: _, ...userWithoutPass} = result

    return res.status(201).json({message: "User successfully created", result: userWithoutPass})
} 

module.exports = {
    signUp
}