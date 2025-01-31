import prisma from '../prisma/db.js';

async function getAllFilesInFolder(folderId) {
  return prisma.file.findMany({
    where: {
      folderId,
    },
  });
}

async function createFile({ name, path, userId, folderId }) {
  return await prisma.file.create({
    data: {
      name,
      path,
      user: {
        connect: {
          id: userId,
        },
      },
      folder: {
        connect: {
          id: folderId,
        },
      },
    },
  });
}

export { getAllFilesInFolder, createFile };
