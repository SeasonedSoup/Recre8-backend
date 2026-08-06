const { prisma } = require("../lib/prisma")

addFriend = async(req, res) => {

    if (!req.user) {
        return res.status(401).json({error: "You are not verified"});
    }

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
    try {

    
    const existingRequest = await prisma.friend.findFirst({
        where: {
            status: "PENDING", 
            userId: req.body.friendId,
            friendId: req.user.userId
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
            status: "FRIENDS"
        }
    })

    res.status(200).json(result)
    } catch (err) {
        console.error(err);
    } 
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
    try {
    const friendships = await prisma.friend.findMany({
        where: {
            status: "FRIENDS",
            OR: [
                {userId: req.user.userId},
                {friendId: req.user.userId}
                ]
        },
        include: {
            sender: true, 
            receiver: true
        }
    })
    //no need to map if no friends
    if (friendships.length == 0) {
        return res.status(200)
    }

    const friendList = friendships.map((friend) => friend.userId === req.user.userId ? friend.receiver : friend.sender)
    
    return res.status(200).json(friendList);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    addFriend,
    acceptFriend,
    deleteFriend,
    getFriends
}