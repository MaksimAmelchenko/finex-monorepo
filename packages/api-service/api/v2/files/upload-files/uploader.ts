import * as multer from 'multer';
import { RequestHandler } from 'express';

const upload: multer.Multer = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 10Mb
  },
});

export const uploader: RequestHandler = upload.any();
