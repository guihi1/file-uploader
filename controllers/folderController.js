import * as folderQueries from '../queries/folderQueries.js';
import * as fileQueries from '../queries/fileQueries.js';

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
const folderGet = async (req, res) => {
  res.render('folders', {
    title: 'Create Folder',
    user: req.user,
  });
};

export { folderGet, folderInboxGet };
