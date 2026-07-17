const { prisma } = require("../lib/prisma")

addFriend = async(req, res) => {
    const result = await prisma.friend.create({
        data: {
            userId: req.user.userId,
            friendId: req.body.friendId
        }
    })
    res.status(200).json(result)
}

acceptFriend = async(req, res) => {
    const result = await prisma.friend.findUnique({
        data: {
    })
    res.status(200).json(result)
}