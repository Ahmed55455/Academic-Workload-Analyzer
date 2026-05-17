// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// This MUST match the exact secret key used in your backend/routes/auth.js
const JWT_SECRET = 'your_academic_workload_secret_key_2026';

function authenticateToken(req, res, next) {
    // Look for the Authorization header (standard format: Bearer TOKEN)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token, block access immediately
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Please log in first.' });
    }

    // Verify the token cryptographically
    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ error: 'Session expired or invalid token. Please log in again.' });
        }

        // Attach the logged-in user's information (id and username) to the request object
        req.user = decodedUser;
        
        // Pass control to the actual API route logic
        next();
    });
}

module.exports = authenticateToken;