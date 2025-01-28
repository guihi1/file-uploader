import prisma from '../prisma/db.js';

async function getUserByEmail(email) {
  return prisma.appUser.findUnique({
    where: { email },
  });
}

async function getUserById(id) {
  return prisma.appUser.findUnique({
    where: { id },
  });
}

async function createUser({ email, password }) {
  return prisma.appUser.create({
    data: {
      email,
      password,
    },
  });
}

export { getUserByEmail, getUserById, createUser };
