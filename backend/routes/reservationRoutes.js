const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  updateReservationAsAdmin,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Customer routes
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.delete('/:id', protect, cancelMyReservation);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReservations);
router.put('/:id', protect, authorize('admin'), updateReservationAsAdmin);

module.exports = router;