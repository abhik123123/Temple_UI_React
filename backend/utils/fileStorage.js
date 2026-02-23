const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default

// Configure multer for local storage
const localStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', UPLOAD_DIR);
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

// Configure multer for memory storage (for S3 upload)
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: STORAGE_TYPE === 's3' ? memoryStorage : localStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter
});

/**
 * Upload file to local storage
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - File URL
 */
const uploadToLocal = async (file) => {
  // File is already saved by multer, just return the URL
  const fileUrl = `/uploads/${file.filename}`;
  return fileUrl;
};

/**
 * Upload file to S3
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - S3 file URL
 */
const uploadToS3 = async (file) => {
  // TODO: Implement S3 upload when credentials are provided
  // For now, throw error if S3 is configured but not implemented
  if (STORAGE_TYPE === 's3') {
    throw new Error('S3 upload not yet configured. Please set STORAGE_TYPE=local in .env');
  }
  
  /* 
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
  */
};

/**
 * Upload file based on storage configuration
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - File URL
 */
const uploadFile = async (file) => {
  if (STORAGE_TYPE === 's3') {
    return await uploadToS3(file);
  } else {
    return await uploadToLocal(file);
  }
};

/**
 * Delete file from local storage
 * @param {string} fileUrl - File URL to delete
 */
const deleteFromLocal = async (fileUrl) => {
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(__dirname, '..', UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    console.log('✓ Deleted file:', filename);
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
};

/**
 * Delete file from S3
 * @param {string} fileUrl - S3 URL to delete
 */
const deleteFromS3 = async (fileUrl) => {
  // TODO: Implement S3 delete when needed
  /*
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  const key = fileUrl.split('.com/')[1]; // Extract key from URL
  await s3.deleteObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  }).promise();
  */
};

/**
 * Delete file based on storage configuration
 * @param {string} fileUrl - File URL to delete
 */
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  if (STORAGE_TYPE === 's3') {
    await deleteFromS3(fileUrl);
  } else {
    await deleteFromLocal(fileUrl);
  }
};

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  STORAGE_TYPE
};
