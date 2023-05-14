const verifyAdmin = (request,response, next)=>{
    if(request.user.role !== 'admin'){
        return response.status(403).json({
            error:'@authenticate/forbidden',
            message:'Access forbidden'
        });
    }

    return next();
};

module.exports = {
    verifyAdmin
};