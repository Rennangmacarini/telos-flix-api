const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/env");

const verifyAuthenticate = (request, response, next) => {
  const { authorization } = request.headers;

  if(!authorization){
    request.isAuthenticated = false;
    return next();
  }

  const [prefix, token] = authorization.split(" ");

  if(prefix !== "Bearer" || !token){
    request.isAuthenticated = false;
    return next();
  }

  jwt.verify(token,JWT_SECRET,(err,decoded) =>{
    if(err){
      request.isAuthenticated = false;
      return next();
    }

    request.user = decoded;
    request.isAuthenticated = true;
    next();
  });  
};

module.exports = {
  verifyAuthenticate,
};
