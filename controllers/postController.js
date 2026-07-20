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

module.exports = {
    createPost
}