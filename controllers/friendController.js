const { prisma } = require("../lib/prisma")

addFriend = async(req, res) => {
    if (req.user.userId === req.body.friendId) {
        return res.status(400).json({error: "You cannot add yourself"})
    }
    const result = await prisma.friend.create({
        data: {
            userId: req.user.userId,
            friendId: req.body.friendId
        }
    })
    res.status(200).json(result)
}

acceptFriend = async(req, res) => {
    const existingRequest = await prisma.friend.findFirst({
        where: {
            status: "PENDING", 
            OR: [
                {userId: req.user.userId, friendId: req.body.friendId},
                {userId: req.body.friendId, friendId: req.user.userId}
            ]
        }
    })

    if (!existingRequest) {
        return res.status(404).json({ error: "Friend request not found or already accepted" });
    }

    const result = await prisma.friend.update({
        where: {
            id : existingRequest.id
        },
        data: {
            status: "ACCEPTED"
        }
    })

    res.status(200).json(result)
}

deleteFriend = async(req, res) => {
    const friendship = await prisma.friend.findFirst({
        where: {
            OR: [
                {userId: req.user.userId, friendId: req.body.friendId},
                {userId: req.body.friendId, friendId: req.user.userId}
                ]
            }
        }
    )
    
    if (!friendship) {
    return res.status(404).json({ error: "Friend request does not exist" });
    }

    const result = await prisma.friend.delete({
        where : {
            id : friendship.id
        }
    })

    res.status(200).json(result)
}

getFriends = async(req, res) => {
    const friendships = await prisma.friend.findMany({
        where: {
            status: "ACCEPTED",
            OR: [
                {userId: req.user.userId, friendId: req.body.friendId},
                {userId: req.body.friendId, friendId: req.user.userId}
                ]
        },
        include: {
            sender: true, 
            receiver: true
        }
    })

    const friendList = friendships.map((friend) => friend.userId === req.user.userId ? friend.receiver : friend.sender)
    
    return res.status(200).json(friendList);
}

module.exports = {
    addFriend,
    acceptFriend,
    deleteFriend
}