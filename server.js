const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const userRoutes = require('./routes/users');
const experienceRoutes = require('./routes/experiences');

const app = express();

// Connect to the SQLite database
const db = new sqlite3.Database('./database/myExperiences.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// To make the database accessible to our models
app.set('db', db);

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // In production, set this to true.
}));

// Middleware for authentication
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}

// Routes
app.use('/api/users', userRoutes);  // User related routes
app.use('/api/experiences', ensureAuthenticated, experienceRoutes); // Experience related routes

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
