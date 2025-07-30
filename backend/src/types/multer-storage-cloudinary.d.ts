declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';
    import { v2 as cloudinary } from 'cloudinary';

    interface CloudinaryStorageOptions {
        cloudinary: typeof cloudinary;
        params?: any;
    }

    class CloudinaryStorage implements StorageEngine {
        constructor(opts: CloudinaryStorageOptions);
        _handleFile(req: any, file: any, cb: (error?: any, info?: any) => void): void;
        _removeFile(req: any, file: any, cb: (error: Error | null) => void): void;
    }

    export { CloudinaryStorage };
}
