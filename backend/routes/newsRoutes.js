const express = require('express');
const router = express.Router();
const { getNews, getNewsById, createNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public read news endpoints
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin-only bulletin creator action
router.post('/', protect, authorizeRoles('admin'), createNews);
router.delete('/:id', protect, authorizeRoles('admin'), deleteNews);

module.exports = router;
