const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ErrorResponse('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
