const db = require('../config/db');

function createUser(username, hashedPassword, email, callback) {
    const sql = "INSERT INTO users(username, password, email) VALUES(?, ?, ?)";
    db.run(sql, [username, hashedPassword, email], function(err) {
        callback(err, this.lastID);
    });
}

function findUserByUsername(username, callback) {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
        callback(err, row);
    });
}

module.exports = {
    createUser,
    findUserByUsername,    
};
