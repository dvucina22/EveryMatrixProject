const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.put('/:id', auth, upload.single('profile_picture'), userController.updateUser);
router.get('/me', auth, userController.getMe);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
  

module.exports = router;
