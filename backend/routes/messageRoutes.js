const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/conversations', auth, messageController.getUserConversations);
router.get('/:user_id', auth, messageController.getConversation);


module.exports = router;
