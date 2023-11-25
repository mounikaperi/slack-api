import multer from 'multer';

const diskStorage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, '../../public/temp');
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  }
})

exports.upload = multer({
  storage: diskStorage
})