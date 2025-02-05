import fs from 'fs';
import * as folderQueries from '../queries/folderQueries.js';
import * as fileQueries from '../queries/fileQueries.js';

const folderGet = async (req, res) => {
  try {
    const folderId = req.params.folderId
      ? parseInt(req.params.folderId, 10)
      : null;
    const folder = folderId
      ? await folderQueries.getFolderById(folderId)
      : await folderQueries.getRootFolder(req.user.id);

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const subfolders = await folderQueries.getSubfolders(folder.id);
    const files = await fileQueries.getAllFilesInFolder(folder.id);
    const folderPath = await folderQueries.getFolderPath(folder.id);

    res.render('folders', {
      title: folderId ? folder.name : 'My Files',
      user: req.user,
      folder,
      folderPath,
      subfolders,
      files,
    });
  } catch (err) {
    console.error('Error fetching folder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const folderCreatePost = async (req, res) => {
  const { name, parentId } = req.body;
  const parsedParentId = parentId ? parseInt(parentId, 10) : null;

  try {
    const newFolder = await folderQueries.createFolder(
      name,
      parsedParentId,
      req.user.id,
    );

    if (!newFolder) {
      return res.status(500).json({ error: 'Error creating folder' });
    }

    return res.redirect(`/folder/${parentId}`);
  } catch (err) {
    console.error('Error creating folder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const folderDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const files = await fileQueries.getAllFilesInFolder(parseInt(id, 10));

    files.forEach(async (file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    const folder = await folderQueries.getFolderById(parseInt(id, 10));

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await folderQueries.deleteFolder(folder.id);

    res.redirect(`/folder/${folder.parentId}`);
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).json({ error: 'Error deleting folder' });
  }
};

const folderRename = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const folder = await folderQueries.getFolderById(parseInt(id, 10));

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await folderQueries.renameFolder(folder.id, name);

    res.redirect(`/folder/${folder.parentId}`);
  } catch (err) {
    console.error('Error renaming folder:', err);
    res.status(500).json({ error: 'Error renaming folder' });
  }
};

const moveItem = async (req, res) => {
  try {
    const { itemId, itemType, targetFolderId } = req.body;

    if (itemType === 'file') {
      await fileQueries.changeFileFolder(
        parseInt(itemId),
        parseInt(targetFolderId),
      );
    } else if (itemType === 'folder') {
      await folderQueries.changeParentFolder(
        parseInt(itemId),
        parseInt(targetFolderId),
      );
    }

    res.redirect(`/folder/my-items`);
  } catch (err) {
    console.error('Error moving item:', err);
    res.status(500).json({ error: 'Error moving item' });
  }
};

export { folderCreatePost, folderGet, folderDelete, folderRename, moveItem };
