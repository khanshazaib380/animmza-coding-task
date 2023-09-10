const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET; // Import your JWT secret from your config file
const {User} = require('../models/models'); // Import your User model or database connection

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const tokenValue = token.replace('Bearer ', '');

        jwt.verify(tokenValue, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }

            // If the token is valid, you can attach the decoded user data to the request object
            req.user = decoded;
            
            // Query the database for user information based on the decoded user ID
            try {
                console.log('decoded ID'+JSON.stringify(decoded.userId))
                const user = await User.findByPk(decoded.userId);


                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized - User not found' });
                }

                // Attach the user data to the request object
                req.userData = user;
                next();
            } catch (error) {
                console.error('Error querying the database:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
