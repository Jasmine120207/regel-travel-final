// ============================================
// Auth Middleware — JWT verification
// ============================================
const jwt = require('jsonwebtoken');

/**
 * Protects routes by verifying JWT token from Authorization header.
 * Attaches userId to req object for downstream use.
 */
const protect = (req, res, next) => {
  let token;

  // Extract token from "Bearer <token>" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid token'
    });
  }
};

module.exports = protect;
