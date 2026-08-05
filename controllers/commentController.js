const {prisma} = require('../lib/prisma');

const commentOnPost = async(req, res) => {
    const postId = req.params.postId
    const text = req.body.comment
    const commenterId = req.user.userId
    
    const result = await prisma.friend.create({
        data: {
            postId,
            commenterId,
            text
        }
    })

    res.status(201).json({message: "Comment successfully submitted on post", comment: result});
}