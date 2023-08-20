const express = require('express');
const router = express.Router();
const experiencesController = require('../controllers/experiences');
const authMiddleware = require('../middlewares/auth');

// Ensure authentication for all routes under /api/experiences
router.use(authMiddleware.ensureAuthenticated);

// Look up all activities in a given region
router.get('/', experiencesController.getExperiencesByRegion);

// Add a new Experience
router.post('/', experiencesController.addExperience);

// Book an Experience
router.post('/:id/book', experiencesController.bookExperience);

module.exports = router;
