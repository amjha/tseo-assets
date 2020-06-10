const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Authorizing...');
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.log('Authorization failed');
        res.status(401).json({message: 'Authorization failed!!'});
    }
}