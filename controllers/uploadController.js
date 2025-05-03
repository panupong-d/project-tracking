const models = require("../models/index");
const multer = require('multer');

// ตั้งค่า multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // โฟลเดอร์ที่เก็บไฟล์
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single('file'); // ใช้ใน route

// ฟังก์ชันเมื่ออัปโหลดเสร็จ
exports.index = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    data: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    }
  });
};