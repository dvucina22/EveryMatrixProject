const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// Dodavanje oglasa
router.post('/', auth, upload.single('image'), itemController.createItem);

// Dohvat svih oglasa
router.get('/', itemController.getAllItems);

// Dohvat pojedinačnog oglasa
router.get('/:id', itemController.getItemById);

// Dohvat oglasa po korisniku
router.get('/user/:id', itemController.getItemsByUser);

// Brisanje oglasa (samo vlasnik oglasa)
router.delete('/:id', auth, itemController.deleteItem);

// Uređivanje oglasa (samo vlasnik oglasa)
router.put('/:id', auth, upload.single('image'), itemController.updateItem);


module.exports = router;
