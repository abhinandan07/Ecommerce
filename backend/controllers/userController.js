const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const { response } = require("express");
const res = require("express/lib/response");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const req = require("express/lib/request");
// register a user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avtar:{
            public_id: " this is a sample id ",
            url:"profilepicurl",

        },
    });

    sendToken(user,201,res);

});

//login user 
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{


    const {email,password} = req.body;
    

    //checking if user give id and password both

    if(!email || !password){
        return next(new ErrorHander("Plese enter email and password",400))

           }
           const user =await User.findOne({email}).select("+password");

           if(!user){
               return next(new ErrorHander("Invalid email and password",401));
           }

            const isPasswordMatched = user.comparePassword(password);


            if(!isPasswordMatched){
                return next(new ErrorHander("Invalid email and password",401));
            }
            sendToken(user,200,res);
});
//Log out user 
exports.logout = catchAsyncErrors(async(req,res,next)=>{
        res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success : true,
        message : "Logged out",

    });

});

//fprgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander("user not found",404));
        //get reset password token
    }
    const resetToken =  user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

 const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

 const message = `your password reset token is :-\n\n ${resetPasswordUrl} \n\nif you have not requested this email then please ignore it`;

 try {
     await sendEmail({
         email:user.email,
         subject :`Ecommerce passwor drecovery`,
         message,


     });

     res.status(200).json({
         success:true,
         message:`Email sent to ${user.email} successfully`,
     });
     
 } catch (error) {
     user.getResetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;
    
     await user.save({validateBeforeSave:false});

     return next(new ErrorHander(error.message,500));
 }


});
//reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
//creating token hash
    const resetPasswordToken=createHash("sha256").update(req.params.Token).digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHander("reset password token is invalid or has been expired",400));
    }

    if(req.body.password !==req.body.confirmPassword){
            return next(new ErrorHander("password does not password",400));
    }
    user.password = req.body.password;
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
});


//get user details 
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        user,
    });
})
// update user password 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);


            if(!isPasswordMatched){
                return next(new ErrorHander("old password is incoorect ",400));
            }

            if(req.body.newPassword !== req.body.confirmPassword){
                return next(new ErrorHander("password does not match ",400));
            }

            user.password = req.body.newPassword;

            await user.save();

            sendToken(user,200, res);
});

// update user profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData= {
        name:req.body.name,
        email:req.body.email,
    }
    // we will add avtar cloudinary later
    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success:true,

    });
 
    
});

// get alll user details
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();

    
    res.status(200).json({
        success:true,
        users,
    });
});


//get single user admin
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`user dose not exist with Id :${req.params.id}`))
    }


    res.status(200).json({
        success:true,
        user,

    });
});

// update user role
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData= {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user =await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if(!user){
        return next(new ErrorHander(`User doesnot exist with id:${req.params.id},400 `))
    }

    res.status(200).json({
        success:true,

    });
 
    
});

//delete user admin

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const newUserData= {
        name:req.body.name,
        email:req.body.email,
    }
      // we will remove avtar cloudinary later
    const user =await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander(`User doesnot exist with id:${req.params.id},400 `))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message:"User deleted successfully",

    });
 
    
});


