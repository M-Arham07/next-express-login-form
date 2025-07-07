const mongoose=require('mongoose');

const Schema=mongoose.Schema;


const otpSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true

    },
    otp:{
        type:String,
        required:true
    
    },
    expiresAt:{
        type:Date, // WE NEED TO CREATE A TTL (Time to Live ) Index in otps collection of MongoDB
                     // SO IT EXPIRES AFTER CERTAIN TIME! (means document removed)
        required:true
    }

},{collection:'otps', timestamps:true}, 
);

module.exports=mongoose.model('OTP',otpSchema);