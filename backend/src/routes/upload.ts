import { Router, Request, Response } from 'express';
import multer from 'multer';
import { storage } from '../services/cloudinary';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    res.status(200).json({
        message: 'File uploaded successfully!',
        imageUrl: req.file.path
    });
});

export default router;
