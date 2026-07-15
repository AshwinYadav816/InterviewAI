const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/blacklist.model');

async function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const isBlacklisted = await tokenBlacklist.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Access denied. Token has been revoked.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { authenticateToken };