const {prisma} = require('../lib/prisma');
const bcryptjs = require('bcryptjs');

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      username: "Alice",
      email: "alice@prisma.io",
      password: bcryptjs.hash("cowgal", 11)
    },
  });
  console.log("Created user:", user);
}

main();