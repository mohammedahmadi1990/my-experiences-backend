const sqlite3 = require('sqlite3').verbose();

// Create a new database or open existing one
const db = new sqlite3.Database('./database/myExperiences.db', (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Create experiences table
    db.run(`CREATE TABLE experiences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exp_name TEXT NOT NULL,
            exp_type TEXT NOT NULL,
            country TEXT NOT NULL,
            region TEXT NOT NULL,
            lon REAL NOT NULL,
            lat REAL NOT NULL,
            exp_description TEXT NOT NULL,
            bookings INTEGER NOT NULL DEFAULT 0
        )`, 
        (err) => {
            if (err) {
                console.log('Table already exists or error in creating table');
            } else {
                console.log('Created experiences table.');
            }
        });

    // Create users table
    db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )`, 
        (err) => {
            if (err) {
                console.log('Table already exists or error in creating table');
            } else {
                console.log('Created users table.');
            }
        });

    // Create bookings table
    db.run(`CREATE TABLE bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            people INTEGER NOT NULL,
            expID INTEGER NOT NULL,
            FOREIGN KEY(expID) REFERENCES experiences(id)
        )`, 
        (err) => {
            if (err) {
                console.log('Table already exists or error in creating table');
            } else {
                console.log('Created bookings table.');
            }
        });
  }
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed SQLite connection.');
});
