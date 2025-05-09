const db = require('../db');

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async ({ email, password, firstName, lastName }) => {
  const result = await db.query(
    `INSERT INTO users (email, password, first_name, last_name) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, first_name, last_name`,
    [email, password, firstName, lastName]
  );
  return result.rows[0];
};

const getUserInfo = async (id) => {
  const result = await db.query(
    `SELECT id, first_name, last_name, email, phone, address, bio, profile_picture 
     FROM users 
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateUserInfo = async (id, { first_name, last_name, phone, address, bio, profile_picture }) => {
  const result = await db.query(
    `UPDATE users 
     SET first_name = $1, last_name = $2, phone = $3, address = $4, bio = $5, profile_picture = $6
     WHERE id = $7
     RETURNING id, first_name, last_name, email, phone, address, bio, profile_picture`,
    [first_name, last_name, phone, address, bio, profile_picture, id]
  );
  return result.rows[0];
};






module.exports = {
  findUserByEmail,
  createUser,
  getUserInfo,
  updateUserInfo
};
