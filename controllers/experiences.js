const Experience = require('../models/Experience');

// Retrieve experiences based on a region
exports.getExperiencesByRegion = (req, res) => {
    const region = req.query.region;

    Experience.findExperiencesByRegion(region, (err, experiences) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(experiences);
    });
};

// Add a new experience
exports.addExperience = (req, res) => {
    const { exp_name, exp_type, country, region, lon, lat, exp_description } = req.body;

    if (!exp_name || !exp_type || !country || !region || !lon || !lat || !exp_description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const experienceData = { exp_name, exp_type, country, region, lon, lat, exp_description };

    Experience.createExperience(experienceData, (err, experienceId) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({ success: true, id: experienceId });
    });
};

// Book an experience
exports.bookExperience = (req, res) => {
    const id = req.params.id;

    Experience.bookExperience(id, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json({ success: true });
    });
};
