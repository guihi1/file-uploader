import express from 'express';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();

router.post('/file/upload', fileController.uploadFilePost);

router.get('/uploads/:path', fileController.fileGet);

router.post('/delete/:id', fileController.deleteFile);

export default router;
