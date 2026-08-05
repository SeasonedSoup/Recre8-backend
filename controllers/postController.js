const {prisma} = require('../lib/prisma')

//no images yet
const createPost = async(req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const authorId = req.user.userId;

    const result = await prisma.post.create({
        data : {
            title,
            content,
            authorId
        }
    });

    res.status(201).json({message: "Post created successfully", post: result});
}

const deletePost = async(req, res) => {
    const {id} = req.body
    
    if (!id) {
        return res.status(400).json({error: "post id is needed to delete"});
    }

    const post = await prisma.post.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!post) {
        return res.status(404).json({error: "Post not found"});
    }

    if (post.authorId != req.user.userId) {
        return res.status(403).json({error: "You are not the owner of this post"});
    }
    
    await prisma.post.delete({
        where: {
            id: Number(id)
        }
    });

    res.sendStatus(204);
}

//testing takes 10 posts
const getPosts = async(req, res) => {
    const posts = await prisma.post.findMany({take: 10})

    res.json(posts)
}

module.exports = {
    createPost,
    deletePost,
    getPosts
}