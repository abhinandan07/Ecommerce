const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto =require("crypto");
const { createHash } = require("crypto");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"Name can not exceed 30 chsrscter"],
        minlength:[4,"Name should have more than 4 character"],
    },
    email:{
        type:String,
        required:[true,"Plese enter your Email"],
        unique:true,
        validate:[validator.isEmail,"plese enter valid email"],
    },
    password:{
        type:String,
        type:String,
        required:[true,"Plese enter your password"],
        minlength:[8,"Password should be greater than 8 character"],
        select:false
        
    },
    avtar:{
        
            public_id:{
                type:String,
                reqired:true
            },
            url:{
                type:String,
                reqired:true
            }
    },
    role:{
        type:String,
        default:"user",

    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();  

    }
    this.password = await bcrypt.hash(this.password,10)
});

//JWT TOKEN 
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};
//compare password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

};
// genrating password reset tokens
userSchema.methods.getResetPasswordToken = function(){
    // genrearing token 
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashing and adding reset password token to userSchema
    this.resetPasswordToken=createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+15*60*1000;
    return resetToken;
    


}

module.exports = mongoose.model("User",userSchema);