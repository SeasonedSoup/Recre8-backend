const { text } = require('express');
const {prisma} = require('./prisma');
const {faker} = require("@faker-js/faker");

async function main() {
    const userData = Array.from(
      {length: 10}, () => ({
        username: faker.person.fullName(),
        password: faker.internet.password(),
        aboutMe: faker.person.bio(),
        email: faker.internet.email(),
        avatar: faker.image.avatar()
      })
    );
  
    
    const users = await prisma.user.createManyAndReturn({
      data : userData,
      skipDuplicates: true
    })

    const postData = users.map((user) => ({
      authorId: user.id,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    }))

    const posts = await prisma.post.createManyAndReturn({
      data: postData,
      skipDuplicates: true
    })

    const commentData = posts.map((post) => ({
      postId: post.id,
      commenterId: faker.helpers.arrayElement(users).id,
      text: faker.lorem.sentence({min: 3, max: 6})
    }))

    await prisma.comment.createMany({
      data: commentData,
      skipDuplicates: true
    })
}

main();