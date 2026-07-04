const Table = require('../models/Table');

// GET /api/tables — any logged-in user needs to see tables to book one
const getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort('tableNumber');
    res.status(200).json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tables — admin only
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: 'tableNumber and capacity are required' });
    }

    const table = await Table.create({ tableNumber, capacity });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTables, createTable };