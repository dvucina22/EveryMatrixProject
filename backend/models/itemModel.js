const db = require('../db');

exports.createItem = async (item) => {
  const { title, description, price, image, user_id, category, country, city, expiration_date } = item;
  return db.query(
    `INSERT INTO items 
      (title, description, price, image, user_id, category, country, city, expiration_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, description, price, image, user_id, category, country, city, expiration_date]
  );
};


exports.getAllItems = async () => {
  return db.query('SELECT * FROM items ORDER BY created_at DESC');
};

exports.getItemById = async (id) => {
  const result = await db.query(
    `SELECT items.*, users.first_name, users.last_name, users.email 
     FROM items 
     JOIN users ON items.user_id = users.id 
     WHERE items.id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.getItemsByUser = async (userId) => {
  return db.query('SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
};

exports.deleteItem = async (id) => {
  return db.query('DELETE FROM items WHERE id = $1', [id]);
};

exports.updateItem = async (item) => {
  const { id, title, description, price, category, country, city, image } = item;
  return db.query(
    `UPDATE items 
     SET title = $1, description = $2, price = $3, category = $4, country = $5, city = $6, image = $7
     WHERE id = $8 RETURNING *`,
    [title, description, price, category, country, city, image, id]
  );
};


