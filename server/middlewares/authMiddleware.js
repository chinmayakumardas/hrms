const jwt = require(process.env.JWTWEBTOKEN);
const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message: process.env.ACCESS_DENIED});
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    }catch(error){
        res.status(403).json({message: process.env.TOKEN_INVALID});
    }
};

module.exports = validateToken;