var jwt = require('jsonwebtoken');
var {secret:SECRET_KEY}=require('../config');
const authenticateMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    console.log(token)
    if (!token) return res.status(401).json({
        success:false
    });
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(401).json({
          success:false
      });
      req.user = user;
       return next();
     });
  };
  module.exports = authenticateMiddleware;