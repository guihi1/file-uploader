import prisma from '../prisma/db.js';

async function getRootFolder(userId) {
  return prisma.folder.findFirst({
    where: {
      userId,
      parentId: null,
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

export { getRootFolder, getSubfolders };
