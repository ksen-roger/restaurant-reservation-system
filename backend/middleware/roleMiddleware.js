// Usage in routes: router.get('/admin-only', protect, authorize('admin'), handler)
// This is your @PreAuthorize("hasRole('ADMIN')") equivalent.
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = { authorize };