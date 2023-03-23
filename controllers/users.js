const mysql = require("mysql2");
const pool = require("../sql/connection");
const { handleSQLError } = require("../sql/error");

const getAllUsers = (req, res) => {
  pool.query(
    `select
  a.id,
  first_name,
  last_name,
  b.user_id,
  address,
  city,
  county,
  state,
  zip,
  phone1,
  phone2,
  email
  from users a 
  join usersAddress b 
  on a.id = b.id
  join usersContact c
  on a.id = c.id`,
    (err, rows) => {
      if (err) return handleSQLError(res, err);
      return res.json(rows);
    }
  );
};

const getUserById = (req, res) => {
  let sql = `select
  a.id,
  first_name,
  last_name,
  b.user_id,
  address,
  city,
  county,
  state,
  zip,
  phone1,
  phone2,
  email
  from users a 
  join usersAddress b 
  on a.id = b.id
  join usersContact c
  on a.id = c.id
  where a.id = ?`;

  sql = mysql.format(sql, [req.params.id]);

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
};

const createUser = (req, res) => {
  let sql = `
    BEGIN;
    INSERT INTO users (first_name, last_name)
    VALUES ('Bogus', 'User');
    INSERT INTO usersAddress (user_id, address, city, county, state, zip)
    VALUES (124, '1234 place', 'yes', 'yo mama', 'square', '12345');
    INSERT INTO usersContact (user_id, phone1, phone2, email)
	  VALUES (124, '123-456-7890', '098-765-4321', 'yomama@mamas.com');
    COMMIT;`;

  sql = mysql.format(sql, [
    req.body.first_name,
    req.body.last_name,
    req.body.user_id,
    req.body.address,
    req.body.city,
    req.body.county,
    req.body.state,
    req.body.zip,
    req.body.user_id,
    req.body.phone1,
    req.body.phone2,
    req.body.email,
  ]);

  pool.query(sql, (err, results, feilds) => {
    if (err) return handleSQLError(res, err);
    return res.json({ newId: results.insertId });
  });
};

const updateUserById = (req, res) => {
  let sql = `UPDATE users SET first_name = 'BogusUpdate', last_name ='UserUpdate' WHERE id = ${req.params.id}`;

  sql = mysql.format(sql, [
    req.body.first_name,
    req.body.last_name,
    req.params.id,
  ]);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.status(204).json();
  });
};

const deleteUserByFirstName = (req, res) => {
  let sql = "DELETE FROM users WHERE first_name = ?";

  sql = mysql.format(sql, [req.params.first_name]);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName,
};
