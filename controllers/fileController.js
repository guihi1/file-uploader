import multer from 'multer';
import fs from 'fs';
import * as fileQueries from '../queries/fileQueries.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single('file');

const uploadFilePost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { folderId } = req.body;
      const fileData = {
        name: req.file.originalname,
        path: req.file.path,
        userId: req.user.id,
        folderId: parseInt(folderId, 10),
      };

      await fileQueries.createFile(fileData);

      res.redirect(`/folder/${folderId}`);
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

const fileGet = (req, res) => {
  const { path } = req.params;
  res.download(`./uploads/${path}`);
};

export { uploadFilePost, fileGet };
