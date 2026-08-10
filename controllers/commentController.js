const {prisma} = require('../lib/prisma');

const commentOnPost = async(req, res) => {
    try {

    
    const postId = req.body.postId
    const text = req.body.comment
    const commenterId = req.user.userId
    
    const result = await prisma.comment.create({
        data: {
            postId,
            commenterId,
            text
        }
    })

    res.status(201).json({message: "Comment successfully submitted on post", comment: result});
} catch(err) {
    console.error(err)
}
}

const deleteCommentById = async(req, res) => {
    const id = Number(req.params.commentId);
    const commenterId = req.user.userId;
    
    if (!id || !commenterId) {
        return res.status(400).json({error: "id and commenterId is required to delete comment"});
    }

    const comment = await prisma.comment.findUnique({
        where: {
            id,
        }
    })

    if (!comment) {
        return res.status(404).json({error: "Comment not found"});
    }

    if (comment.commenterId != commenterId) {
        return res.status(403).json({error: "You do not own this comment"});
    }

    await prisma.comment.delete({
        where: {
            id,
        }
    })

    res.sendStatus(204);
}

const getCommentsOnPost = async(req, res) => {
    const postId = Number(req.params.postId) 

    if (Number.isNaN(postId) || postId.trim() === "") {
        return res.status(400).json({error: "Not a valid id"})
    }

    const post = await prisma.post.findUnique({
        where : {
            id: postId
        }
    })

    if (!post) {
        return res.status(404).json({error: "Post ID not found"})
    }

    const result = await prisma.comment.findMany({
        where: {
            postId: postId
        }
    })
    
    res.json(result);
}

module.exports = {
    commentOnPost,
    deleteCommentById,
    getCommentsOnPost
}