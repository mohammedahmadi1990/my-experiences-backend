const db = require('../config/db');

// Create a booking for an experience
function createBooking(people, expID, callback) {
    const sql = "INSERT INTO bookings(people, expID) VALUES(?, ?)";
    db.run(sql, [people, expID], function(err) {
        callback(err, this.lastID);
    });
}

// Fetch bookings for a particular experience
function getBookingsByExperience(expID, callback) {
    const sql = "SELECT * FROM bookings WHERE expID = ?";
    db.all(sql, [expID], (err, rows) => {
        callback(err, rows);
    });
}

// Fetch a particular booking by its ID
function getBookingById(id, callback) {
    const sql = "SELECT * FROM bookings WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

// Delete a booking
function deleteBooking(id, callback) {
    const sql = "DELETE FROM bookings WHERE id = ?";
    db.run(sql, [id], function(err) {
        callback(err);
    });
}


module.exports = {
    createBooking,
    getBookingsByExperience,
    getBookingById,
    deleteBooking,
};
