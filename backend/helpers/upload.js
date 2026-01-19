import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (go up from backend/helpers to project root)
// __dirname is backend/helpers, so we need to go up 2 levels to get to project root
const PROJECT_ROOT = path.join(__dirname, '../..');
const UPLOAD_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');

// Ensure upload directories exist
const ensureDirectories = () => {
  const dirs = [
    path.join(UPLOAD_DIR, 'anunturi'),
    path.join(UPLOAD_DIR, 'faces'),
    path.join(UPLOAD_DIR, 'photos', 'thumbs')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_DIR;
    
    if (file.fieldname === 'imagine') {
      uploadPath = path.join(uploadPath, 'anunturi');
    } else if (file.fieldname === 'document') {
      uploadPath = path.join(uploadPath, 'anunturi');
    } else if (file.fieldname === 'face') {
      uploadPath = path.join(uploadPath, 'faces');
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  if (allowedMimes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter
});

export const uploadFields = upload.fields([
  { name: 'imagine', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'face', maxCount: 1 }
]);

