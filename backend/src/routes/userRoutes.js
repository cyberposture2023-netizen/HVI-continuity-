const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { getAllUsers, getUser, updateUser, deleteUser, getUserHVIScores } = require('../controllers/userController');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/', restrictTo('admin', 'assessor'), getAllUsers);
router.get('/:id', getUser);
router.get('/:id/hvi-scores', getUserHVIScores);
router.put('/:id', updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

module.exports = router;
