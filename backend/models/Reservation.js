const mongoose = require('mongoose');

// Design decision: we use FIXED time slots instead of free-form start/end times.
// This keeps the "overlap" check simple: two reservations conflict only if they
// share the same table + same date + same slot. Document this assumption in your README.
const TIME_SLOTS = [
  '12:00-13:30',
  '13:30-15:00',
  '19:00-20:30',
  '20:30-22:00',
];

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // like a @ManyToOne foreign key reference
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: TIME_SLOTS,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

reservationSchema.statics.TIME_SLOTS = TIME_SLOTS;

module.exports = mongoose.model('Reservation', reservationSchema);