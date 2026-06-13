const News = require('../models/News');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
const getNews = async (req, res, next) => {
  try {
    const articles = await News.find({ status: 'published' })
      .populate('publishedBy', 'name')
      .sort({ publishedAt: -1 }); // Newest first
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single news article by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res, next) => {
  try {
    const article = await News.findById(req.params.id).populate('publishedBy', 'name');
    
    if (!article) {
      return res.status(404).json({
        error: 'Not Found',
        message: `News article with ID ${req.params.id} does not exist.`
      });
    }

    res.json(article);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Article not found. Invalid ID format.' });
    }
    next(error);
  }
};

// @desc    Create a new news article (Admin only)
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res, next) => {
  try {
    const { title, summary, content, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Article title is required.' });
    }

    if (!summary || !summary.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Article summary is required.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Article body content is required.' });
    }

    const titleExists = await News.findOne({ title: title.trim() });
    if (titleExists) {
      return res.status(409).json({ error: 'Conflict Error', message: 'An article with this title already exists.' });
    }

    const article = await News.create({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      category: category || 'newsletter',
      publishedBy: req.user._id,
      status: 'published'
    });

    res.status(201).json({
      success: true,
      message: 'News article published successfully!',
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a news article (Admin only)
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res, next) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        error: 'Not Found',
        message: `News article with ID ${req.params.id} does not exist.`
      });
    }

    res.json({
      success: true,
      message: 'News article deleted successfully!'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Not Found', message: 'Article not found. Invalid ID format.' });
    }
    next(error);
  }
};

module.exports = {
  getNews,
  getNewsById,
  createNews,
  deleteNews
};
