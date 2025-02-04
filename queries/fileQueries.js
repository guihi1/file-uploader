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

async function createFile({ name, path, size, userId, folderId }) {
  return await prisma.file.create({
    data: {
      name,
      path,
      size,
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

async function changeFileFolder(fileId, folderId) {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      folderId,
    },
  });
}

export {
  changeFileFolder,
  getAllFilesInFolder,
  createFile,
  deleteFile,
  getFileById,
};
