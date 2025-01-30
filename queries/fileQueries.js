import prisma from '../prisma/db.js';

async function getAllFilesInFolder(folderId) {
  return prisma.file.findMany({
    where: {
      folderId,
    },
  });
}

export { getAllFilesInFolder };
