const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // In production, set this to true.
}));

// Connect to the SQLite database
const db = new sqlite3.Database('./database/myExperiences.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Middleware for authentication
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}

// Routes

// User Register
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // You might want to add validations here
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }
        
        const sql = "INSERT INTO users(username, password, email) VALUES(?, ?, ?)";
        db.run(sql, [username, hashedPassword, email], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "User registered successfully", id: this.lastID });
        });
    });
});


// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Compare the hashed password from the database with the provided password
      bcrypt.compare(password, row.password, (err, match) => {
        if (match) {
          req.session.user = { id: row.id, username: row.username };
          res.json({ message: "Logged in successfully" });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      });
    });
  });

// User logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});


// Look up all activities in a given region
app.get('/api/experiences', ensureAuthenticated, (req, res) => {
    const region = req.query.region;
    
    db.all('SELECT * FROM experiences WHERE region = ?', [region], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        
        res.json(rows);
    });
});


// Add a new Experience
app.post('/api/experiences', ensureAuthenticated, (req, res) => {
    const { exp_name, exp_type, country, region, lon, lat, exp_description } = req.body;

    if (!exp_name || !exp_type || !country || !region || !lon || !lat || !exp_description) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const query = 'INSERT INTO experiences(exp_name, exp_type, country, region, lon, lat, exp_description, bookings) VALUES(?,?,?,?,?,?,?,0)';
    const values = [exp_name, exp_type, country, region, lon, lat, exp_description];

    db.run(query, values, function(err) {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }

        res.json({ success: true, id: this.lastID });
    });
});


// Book an Experience
app.post('/api/experiences/:id/book', ensureAuthenticated, (req, res) => {
    const id = req.params.id;

    db.run('UPDATE experiences SET bookings = bookings + 1 WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'Experience not found' });
            return;
        }

        res.json({ success: true });
    });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
