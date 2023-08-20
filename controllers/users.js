const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a user
exports.registerUser = (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        User.createUser(username, hashedPassword, email, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "User registered successfully", id: userId });
        });
    });
};

// Login a user
exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    User.findUserByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (match) {
                req.session.user = { id: user.id, username: user.username };
                res.json({ message: "Logged in successfully" });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        });
    });
};

// Logout a user
exports.logoutUser = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
};
