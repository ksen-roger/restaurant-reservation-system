const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is the equivalent of your Spring Security JWT filter.
// It runs BEFORE the route handler, checks the token, and attaches
// the logged-in user to req.user so controllers can use it.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user; // downstream handlers read req.user
    next(); // move on to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

module.exports = { protect };