import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, folder = "blogs") => {
    try {
        if (!localFilePath) return null;

        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: folder,
            resource_type: "auto",
            transformation: [
                { width: 1200, height: 630, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });

        // File uploaded successfully, delete from local
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Remove locally saved temp file if upload failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };