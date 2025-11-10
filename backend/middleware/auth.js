const JWTUtils = require('../utils/jwt-utils');
const User = require('../models/User');

const authMiddleware = {
  // Verify JWT token and attach user to request
  authenticateToken: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token required',
          code: 'TOKEN_REQUIRED'
        });
      }

      // Verify token
      const decoded = JWTUtils.verifyAccessToken(token);
      
      // Find user in database
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          code: 'USER_INACTIVE'
        });
      }

      // Attach user to request object
      req.user = user.getProfile();
      req.token = token;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'TOKEN_INVALID',
        details: error.message
      });
    }
  },

  // Optional authentication - doesn't fail if no token
  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        const decoded = JWTUtils.verifyAccessToken(token);
        const user = await User.findById(decoded.userId);
        
        if (user && user.isActive) {
          req.user = user.getProfile();
          req.token = token;
        }
      }
      
      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  },

  // Role-based authorization
  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles,
          current: req.user.role
        });
      }

      next();
    };
  },

  // Department-based authorization
  requireDepartment: (departments) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!Array.isArray(departments)) {
        departments = [departments];
      }

      if (!departments.includes(req.user.department)) {
        return res.status(403).json({
          success: false,
          message: 'Access restricted to specific departments',
          code: 'DEPARTMENT_RESTRICTED',
          required: departments,
          current: req.user.department
        });
      }

      next();
    };
  }
};

module.exports = authMiddleware;
