const express = require('express')
const MovieCtl = require('../controllers/movieControllers')
const multer = require('multer')
const path = require('path')

const router = express.Router();

router.use(express.urlencoded());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
})

const filefilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg and .jpeg images are allowed"));
    }
}

const upload = multer({
    storage: storage, fileFilter: filefilter
})

router.get('/addMovie', MovieCtl.addMovie);
router.post('/addNewMovie', upload.single('image'), MovieCtl.addNewMovie);
router.get('/', MovieCtl.getAllMovies);

module.exports = router;