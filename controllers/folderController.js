import * as folderQueries from '../queries/folderQueries.js';
import * as fileQueries from '../queries/fileQueries.js';
import * as userQueries from '../queries/userQueries.js';

const folderInboxGet = async (req, res) => {
  try {
    const rootFolder = await folderQueries.getRootFolder(req.user.id);

    if (!rootFolder) {
      return res.status(404).json({ error: 'Root folder not found' });
    }

    const subfolders = await folderQueries.getSubfolders(rootFolder.id);
    const files = await fileQueries.getAllFilesInFolder(rootFolder.id);

    res.render('folders', {
      title: 'Inbox',
      user: req.user,
      folder: rootFolder,
      subfolders,
      files,
    });
  } catch (err) {
    console.error('Error fetching inbox folder:', err);
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

    return res.redirect('/folder/inbox');
  } catch (err) {
    console.error('Error creating folder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { folderCreatePost, folderInboxGet };
