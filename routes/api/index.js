

// Set requirements (Express Router)
const router = require('express').Router();

// Set routes (user and thought routes)
const userRoutes = require('./userRoutes');
const thoughtsRoutes = require('./thoughtRoutes');

// Add `/users` to created routes 
router.use('/users', userRoutes);

// Add `/thoughts` to created routes 
router.use('/thoughts', thoughtsRoutes);

// Export Module Router
module.exports = router;