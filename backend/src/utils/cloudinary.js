import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier" // Install this: npm install streamifier

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Pass the file buffer instead of localFilePath
const uploadOnCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) resolve(null);

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed:", error);
                    resolve(null);
                } else {
                    resolve(result);
                }
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

export { uploadOnCloudinary }