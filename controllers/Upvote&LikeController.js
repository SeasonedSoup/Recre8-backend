const {prisma} = require('../lib/prisma');

toggleLike = async(req, res) => {
    const userId = req.user.userId
    const postId = Number(req.body.postId)

    const like = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    })

    if (like) {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        })
    } else {
        await prisma.like.create({
            data: {
                userId,
                postId
            }
        })
    }

    res.send(200).json({message: "Toggled successfully"})
}


toggleUpvote = async(req, res) => {
    const userId = req.user.userId
    const commentId = Number(req.body.commentId)

    const upvote = await prisma.upvote.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId
            }
        }
    })

    if (upvote) {
        await prisma.upvote.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        })
    } else {
        await prisma.upvote.create({
            data: {
                userId,
                commentId
            }
        })
    }

    res.send(200).json({message: "Toggled successfully"})
}




module.exports = {
    toggleLike,
    toggleUpvote
}