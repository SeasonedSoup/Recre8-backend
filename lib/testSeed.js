const {prisma} = require('../lib/prisma');

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      username: "Alice",
      email: "alice@prisma.io",
      password: "cowgal"
    },
  });
  console.log("Created user:", user);
}

main();