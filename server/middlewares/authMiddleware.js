const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Authentication required.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        req.user = decoded;
        next();
    });
};

module.exports = { authenticateUser };
