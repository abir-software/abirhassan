// ========================================
// AUTHENTICATION MIDDLEWARE & UTILS
// ========================================
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a JWT token for authenticated user
 */
export function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Express middleware to verify JWT token on protected routes
 */
export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
