const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Normalizes any date to midnight UTC, so date comparisons are exact
// regardless of what time-of-day format the client sends.
const normalizeDate = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// POST /api/reservations
const createReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests } = req.body;

    if (!tableId || !date || !timeSlot || !guests) {
      return res.status(400).json({
        message: 'tableId, date, timeSlot and guests are all required',
      });
    }

    if (!Reservation.TIME_SLOTS.includes(timeSlot)) {
      return res.status(400).json({
        message: `Invalid time slot. Valid options: ${Reservation.TIME_SLOTS.join(', ')}`,
      });
    }

    const table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (guests > table.capacity) {
      return res.status(400).json({
        message: `Table ${table.tableNumber} only seats ${table.capacity} guests`,
      });
    }

    const normalizedDate = normalizeDate(date);

    const today = normalizeDate(new Date());
    if (normalizedDate < today) {
      return res.status(400).json({ message: 'Cannot book a date in the past' });
    }

    const conflict = await Reservation.findOne({
      table: tableId,
      date: normalizedDate,
      timeSlot,
      status: 'confirmed',
    });

    if (conflict) {
      return res.status(409).json({
        message: 'This table is already booked for the selected date and time slot',
      });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: tableId,
      date: normalizedDate,
      timeSlot,
      guests,
    });

    const populated = await reservation.populate('table', 'tableNumber capacity');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reservations/my
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort('-date');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reservations/:id
const cancelMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own reservations' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    res.status(200).json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reservations (admin) - optional ?date= filter
const getAllReservations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) {
      filter.date = normalizeDate(req.query.date);
    }

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort('-date');

    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/reservations/:id (admin) - update or cancel any reservation
const updateReservationAsAdmin = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const { status, guests, timeSlot, date } = req.body;
    if (status) reservation.status = status;
    if (guests) reservation.guests = guests;
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (date) reservation.date = normalizeDate(date);

    const updated = await reservation.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  updateReservationAsAdmin,
};