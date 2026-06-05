// this is the JWT authentication middleware
import jwt from 'jsonwebtoken';

//middleware to verify the jwt token on protected routes
const verifyToken = (req, res, next) => {
    //get token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //if no token return 401 unauthorized
    if(!token) {
      return res.status(401).json({ message: 'Access  denied. No token provided.'});
    }

    try {
        //verify the token using jwt secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        //token is invalid or expired
        return res.status(403).json({message: 'Invalid or expired token'});

    }
    };

    //middleware to check if the user is advisor or not
    export const isAdvisor = (req, res, next) => {
        if (req.user.role !== 'advisor') {
          return res.status(403).json({ message: 'Access denied. Advisors only.'});

        } 
        next();
    };

    //middleware to check if user is a student
    export const isStudent = (req, res, next) => {
        if (req.user.role !== 'student') {
          return res.status(403).json({ message: 'Access denied. Student only.'});
        }
        next();
    };

export default verifyToken;