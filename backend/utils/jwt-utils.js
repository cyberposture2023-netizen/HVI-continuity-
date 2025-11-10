const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWTUtils {
  // Generate access token
  static generateAccessToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'hvi-continuity-platform',
        audience: 'hvi-continuity-users'
      }
    );
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
        issuer: 'hvi-continuity-platform',
        audience: 'hvi-continuity-users'
      }
    );
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'hvi-continuity-platform',
        audience: 'hvi-continuity-users'
      });
    } catch (error) {
      throw new Error(`Invalid access token: ${error.message}`);
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        issuer: 'hvi-continuity-platform',
        audience: 'hvi-continuity-users'
      });
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  // Decode token without verification (for inspection)
  static decodeToken(token) {
    return jwt.decode(token);
  }

  // Check if token is about to expire (within threshold)
  static isTokenExpiringSoon(token, thresholdMinutes = 15) {
    try {
      const decoded = this.verifyAccessToken(token);
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;
      return timeUntilExpiry < (thresholdMinutes * 60);
    } catch (error) {
      return true; // Consider expired if invalid
    }
  }

  // Generate token pair (access + refresh)
  static generateTokenPair(user) {
    const accessTokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      type: 'access'
    };

    const refreshTokenPayload = {
      userId: user._id.toString(),
      type: 'refresh'
    };

    return {
      accessToken: this.generateAccessToken(accessTokenPayload),
      refreshToken: this.generateRefreshToken(refreshTokenPayload),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }

  // Refresh access token using refresh token
  static refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Return new access token
      const accessTokenPayload = {
        userId: decoded.userId,
        type: 'access'
      };

      return this.generateAccessToken(accessTokenPayload);
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}

module.exports = JWTUtils;
