const express = require('express');
const router = express.Router();
const { getTables, createTable } = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getTables);
router.post('/', protect, authorize('admin'), createTable);

module.exports = router;