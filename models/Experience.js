const db = require('../config/db');

function createExperience(data, callback) {
    const query = 'INSERT INTO experiences(exp_name, exp_type, country, region, lon, lat, exp_description, bookings) VALUES(?,?,?,?,?,?,?,0)';
    const values = [data.exp_name, data.exp_type, data.country, data.region, data.lon, data.lat, data.exp_description];
    
    db.run(query, values, function(err) {
        callback(err, this.lastID);
    });
}

function findExperiencesByRegion(region, callback) {
    const query = 'SELECT * FROM experiences WHERE region = ?';
    db.all(query, [region], (err, rows) => {
        callback(err, rows);
    });
}

function bookExperience(id, callback) {
    const query = 'UPDATE experiences SET bookings = bookings + 1 WHERE id = ?';
    db.run(query, [id], function(err) {
        callback(err, this.changes);
    });
}


module.exports = {
    createExperience,
    findExperiencesByRegion,
    bookExperience,    
};
