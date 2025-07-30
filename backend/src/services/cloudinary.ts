import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
// In a real app, these values would come from a .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BibleNotes',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    // @ts-ignore
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

export { cloudinary, storage };
