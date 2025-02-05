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

async function getFolderPath(folderId) {
  let folderPath = [];
  let currentFolder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { id: true, name: true, parentId: true },
  });

  while (currentFolder && currentFolder.parentId) {
    folderPath.push({
      id: currentFolder.id,
      name: currentFolder.name,
      url: `/folder/${currentFolder.id}`,
    });

    currentFolder = await prisma.folder.findUnique({
      where: { id: currentFolder.parentId },
      select: { id: true, name: true, parentId: true },
    });
  }

  return folderPath.reverse();
}

async function deleteFolder(folderId) {
  return await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
}

async function renameFolder(folderId, name) {
  return await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name,
    },
  });
}

async function changeParentFolder(folderId, parentId) {
  return await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      parentId,
    },
  });
}

export {
  changeParentFolder,
  getFolderById,
  createFolder,
  getRootFolder,
  getSubfolders,
  getFolderPath,
  deleteFolder,
  renameFolder,
};
