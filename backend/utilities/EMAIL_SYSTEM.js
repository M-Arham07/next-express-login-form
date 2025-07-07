
const nodemailer=require('nodemailer');
const dotenv=require('dotenv').config({path:'../.env'});
const mongoose=require('mongoose');
// OTP COLLECTION MODEL:
const OTP= require('./OTP_SCHEMA')






// GLOBAL TRANSPORTER:

   const transporter=nodemailer.createTransport({
    service:process.env.SERVICE_NAME,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
   });


function SEND_WELCOME_EMAIL(USER_EMAIL){



   const $SUBJECT="Your account is ready — start exploring!"

   const $HTML="<h1> Welcome to our website! </h1> <p> We are thrilled to provide you with the best user experience! This website was made by M.Arham!  </p>"

   const emailOptions={
    from:process.env.USER,
    to: USER_EMAIL,
    subject: $SUBJECT,
    html: $HTML
   }

   transporter.sendMail(emailOptions,(err,info)=>{
    if(err){
        return console.log(err)
    }
    else{
        return console.log(info.response)
    }
   });



}

// this function will send and store otp in the db for 10 MINUTES
function SEND_OTP(USER_EMAIL){


    const OTP=(Math.floor(Math.random()*900000)+100000).toString(); // !ALWAYS CONVERT OTP TO STRING
   
  
    const $SUBJECT="Your Password Reset OTP Code";

    const $HTML=` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #007BFF;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #007BFF;
      margin: 25px 0;
      text-align: center;
      background: #e7f0fe;
      padding: 15px;
      border-radius: 6px;
      user-select: all;
    }
    .footer {
      font-size: 14px;
      color: #777;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hi,</p>
    <p>We received a request to reset your password. Use the One-Time Password (OTP) below to verify your identity and reset your password:</p>
    
    <div class="otp-code">${OTP}</div>
    
    <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support immediately.</p>
    
    <p>Thanks,<br />The Support Team</p>
    
    <div class="footer">
      &copy; 2025 Made by M.Arham. All rights reserved.
    </div>
  </div>
</body>
</html>
    `

    const emailOptions={
        from:  process.env.SERVICE_NAME  ,
        to: USER_EMAIL, 
        subject: $SUBJECT ,
        html: $HTML
    }

    // i will use a promise and use resolve OR reject to send success status (sent:true/false)
    // promise is necessary to log things cuz sendEmail is ASYNC !
  return new Promise((resolve,reject)=>{
   

    transporter.sendMail(emailOptions,async (err,info)=>{
        if(err){
            console.error(err)
           return reject({sent:false});
        }

        // INSERTING OTP IN DATABASE FOR 10 MINUTES!
        const isOTPInserted = await STORE_OTP(USER_EMAIL,OTP);
        if(!isOTPInserted){
          return reject({sent:false}) // i will not be creating another property for this, so i used existing
        }
        

        
        console.log(info.response)
        return resolve({otp:OTP,sent:true})
    })

  });
    
    

}








 // LOGIC TO STORE OTP IN DATABASE FOR 10 Minutes

 async function STORE_OTP(email,otp){
  const expiry= new Date(Date.now() + 10 * 60 * 1000); // Calculates time 10 minutes from NOW
  // console.log(expiresAt)

  const info= await OTP.insertOne({email:email, otp:otp ,expiresAt:expiry});
  
  return info ? true : false;

 }
 
 // can be used inside other async function like STORE_OTP("email@example.com",$otp)


 async function COMPARE_OTP(USER_EMAIL,USER_OTP){

  const info= await OTP.findOne({email:USER_EMAIL});

  
  // if info exists, do this:
 return info.otp === USER_OTP ? true : false;
  


 }





// FOR DEBUGGING ONLY:
// SEND_OTP("youremail@gmail.com").then(INFO=>console.log(INFO.otp)).catch(error=>console.log(error.sent))



//FOR DEBUGGING ONLY : SEND_WELCOME_EMAIL('youremail@example.com');




module.exports={SEND_WELCOME_EMAIL,SEND_OTP,COMPARE_OTP}