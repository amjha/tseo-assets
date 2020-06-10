const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Authorizing...');
    try {
        // console.log(req.headers);
        console.log(req.headers.Authorization);
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ');
        next();
    } catch (err) {
        console.log('Authorization failed');
        res.status(401).json({message: 'Authorization failed!!'});
    }
}
