import prisma from '../prisma/db.js';

async function getRootFolder(userId) {
  return prisma.folder.findFirst({
    where: {
      userId,
      parentId: null,
    },
  });
}

async function getFolderById(folderId) {
  return prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
}

async function getSubfolders(folderId) {
  return prisma.folder.findMany({
    where: {
      parentId: folderId,
    },
  });
}

async function createFolder(name, parentId, userId) {
  return prisma.folder.create({
    data: {
      name,
      parentId,
      userId,
    },
  });
}

export { getFolderById, createFolder, getRootFolder, getSubfolders };
