const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/env");

const verifyAuthenticate = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    // return response.status(401).json({
    //   error: "@authenticate/missing-token",
    //   message: "Token not sent",
    // });
    request.isAuthenticated = false;
    return next();
  }

  const [prefix, token] = authorization.split(" ");

  const invalidTokenMessage = {
    error: "@authenticate/invalid-token",
    message: "Token provided is invalid",
  };

  if (prefix !== "Bearer") {

    request.isAuthenticated = false;
    
    return response.status(401).json(invalidTokenMessage);
  }

  if (!token) {

    request.isAuthenticated = false;
    
    return response.status(401).json(invalidTokenMessage);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {    
      
      request.isAuthenticated = false;
      
      return response.status(401).json(invalidTokenMessage);
    }    

    request.user = decoded;  
    request.isAuthenticated = true;  

    return next();
  });
};

module.exports = {
  verifyAuthenticate,
};
