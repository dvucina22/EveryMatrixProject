const messageModel = require('../models/messageModel');

exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, content } = req.body;
    const result = await messageModel.sendMessage({ sender_id, receiver_id, content });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška prilikom slanja poruke' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = parseInt(req.params.user_id);
    if (isNaN(user2)) {
      return res.status(400).json({ message: 'Neispravan ID korisnika' });
    }
    const result = await messageModel.getMessagesBetweenUsers(user1, user2);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška prilikom dohvaćanja poruka' });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await messageModel.getUserConversations(userId);
    res.json(conversations.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška kod dohvaćanja razgovora' });
  }
};
