const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.log('Authorization failed');
        res.status(401).json({message: 'Authorization failed!!'});
    }
}
