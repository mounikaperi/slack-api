import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryUploadedResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    console.log('File has been uploaded successfully on cloudinary and the url is: ', cloudinaryUploadedResponse.url);
    return cloudinaryUploadedResponse;
  } catch (error) {
    // For any reason if the fils upload fails, remove the files from server
    fs.unlinkSync(localFilePath);
    return null;
  }
}

export { uploadOnCloudinary };