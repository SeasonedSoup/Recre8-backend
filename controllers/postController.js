const { prisma } = require('../lib/prisma');
const { supabase } = require('../lib/supabase.js');

//no images yet
const createPost = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const authorId = req.user.userId;

  const result = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    }
  });

  if (!result) {
    return res.status(400).json({ error: "Error Creating Post" });
  }

  const imageUrls = req.supabaseUrls.map((imageUrl) => ({
    url: imageUrl,
    postId: result.id
  }));

  await prisma.postImage.createMany({
    data: imageUrls
  })

  res.status(201).json({ message: "Post created successfully", post: result });
}

const deletePost = async (req, res) => {
  const id = req.params.postId

  if (!id) {
    return res.status(400).json({ error: "post id is needed to delete" });
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (post.authorId != req.user.userId) {
    return res.status(403).json({ error: "You are not the owner of this post" });
  }
  if (post.postImages && post.postImages.length > 0) {
    const fileUrls = post.postImages.map((postImage) => {
      postImage.split("/Post_Images/")[1];
    })
  }
  await prisma.post.delete({
    where: {
      id: Number(id)
    }
  });

  res.sendStatus(204);
}

//testing takes 10 posts
const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      postImages: true,
      author: true,
      comments: {
        include: {
          commenter: {
            select: {
              username: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              upvotes: true
            }
          }
        },
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  })


  res.json(posts);
}

const getUserPosts = async (req, res) => {
  const userId = Number(req.userId);

  const posts = await prisma.post.findMany({
    include: {
      postImages: true,
      author: true,
      comments: {
        include: {
          commenter: {
            select: {
              username: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              upvotes: true
            }
          }
        },
      },
      _count: {
        select: {
          likes: true
        }
      }
    },
    where: {
      authorId: userId
    }
  })

  return res.status(200).json(posts);
}

const getFriendPosts = async (req, res) => {
  const userId = Number(req.userId);

  const posts = await prisma.post.findMany({
    include: {
      postImages: true,
      author: true,
      comments: {
        include: {
          commenter: {
            select: {
              username: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              upvotes: true
            }
          }
        },
      },
      _count: {
        select: {
          likes: true
        }
      }
    },
    where: {
      author: {
        OR: [
          {
            sentFriendRequest: {
              some: {
                friendId: userId,
                status: "FRIENDS"
              }
            }
          },
          {
            receivedFriendRequest: {
              some: {
                userId: userId,
                status: "FRIENDS"
              }
            }
          }
        ]
      }
    },
    orderBy: {
      id: 'desc'
    }
  })

  return res.status(200).json(posts);
}



module.exports = {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
  getFriendPosts,
}
