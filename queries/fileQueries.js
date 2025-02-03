import prisma from '../prisma/db.js';

async function getFileById(fileId) {
  return prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
}

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

async function deleteFile(fileId) {
  return await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
}

export { getAllFilesInFolder, createFile, deleteFile, getFileById };
