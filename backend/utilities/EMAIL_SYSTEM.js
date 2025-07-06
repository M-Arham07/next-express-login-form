
const nodemailer=require('nodemailer');
const dotenv=require('dotenv').config({path:'../.env'});


function SEND_WELCOME_EMAIL(USER_EMAIL){

   const transporter=nodemailer.createTransport({
    service:process.env.SERVICE_NAME,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
   });


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


// FOR DEBUGGING ONLY : SEND_WELCOME_EMAIL('youremail@example.com');







module.exports={SEND_WELCOME_EMAIL}