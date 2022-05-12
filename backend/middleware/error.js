const ErrorHandler = require("../utils/errorhander");


module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server erroe";

    // wrong mongodb id error:
    if (err.name === "CastError"){
        const message = ` Resource not found. invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    };

//mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    };

    // wrong jwt error:
    if (err.name === "JsonWebTokenError"){
        const message = ` Json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    };
//wrong jwt expire error
    if (err.name === "TokensExpiredError"){
        const message = ` Json web token is expired, try again`;
        err = new ErrorHandler(message, 400);
    };

    res.status(err.statusCode).json({
        success: false,
        message :err.message,
    });

};