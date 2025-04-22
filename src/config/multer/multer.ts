import path from "path";
import { Request } from "express";

import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req: Request, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
export default upload;