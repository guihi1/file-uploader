import express from 'express';
import * as folderController from '../controllers/folderController.js';

const router = express.Router();

router.get('/folder/inbox', folderController.folderInboxGet);

router.get('/folder/:folderId');

export default router;
