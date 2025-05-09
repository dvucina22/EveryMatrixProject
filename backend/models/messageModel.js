const db = require('../db');

exports.sendMessage = async ({ sender_id, receiver_id, content }) => {
  return db.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [sender_id, receiver_id, content]
  );
};

exports.getMessagesBetweenUsers = async (user1, user2) => {
  return db.query(
    `SELECT * FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );
};

exports.getUserConversations = async (userId) => {
  return db.query(
    `
    SELECT u.id, u.first_name, u.last_name, u.email
    FROM users u
    WHERE u.id IN (
      SELECT DISTINCT CASE
        WHEN sender_id = $1 THEN receiver_id
        WHEN receiver_id = $1 THEN sender_id
      END
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
    )
    `,
    [userId]
  );
};
