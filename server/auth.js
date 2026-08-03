// ========================================
// AUTH — JWT middleware
// ========================================
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abir-cms-secret-key-2024';
const JWT_EXPIRES = '7d';

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = auth.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}
