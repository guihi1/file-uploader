import prisma from '../prisma/db';

async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export { getUserByEmail, getUserById };
