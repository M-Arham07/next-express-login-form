const mongoose = require('mongoose');


const express = require('express');
const router = express.Router();

const User = require('./UserModel');
const { ValidateLogin_Input, ValidateSignUP_Input, CHECK_VALID_EMAIL } = require('./utilities/InputValidatorBACKEND');
const bcrypt = require('bcrypt');
const dotenv=require('dotenv').config({path:'./.env'});



// JWT:
const jwt=require('jsonwebtoken');

// Welcome Email sender after user logs in and OTP SENDER/COMPARER/DELETER!
const { SEND_WELCOME_EMAIL, SEND_OTP, COMPARE_OTP,DELETE_OTP } = require('./utilities/EMAIL_SYSTEM')

// LISTING ALL USERS:
// router.get('/', async (req,res)=>{ 
//  const data= await User.find({})
//  res.json(data);
// });





//SIGN_UP ROUTE
function SIGN_UP() {

        router.post('/sign-up', async (req, res) => {
                // console.log(req.body) // FOR debugging only!
                try {
                        let { email, password, confirmed_password } = req.body; // now email, password and confimed_password are separate variables by object destructring

                        email = email.trim().toLowerCase();
                        // Email addresses NOT CASE SENSITIVE, means ABC@example.com is same as abc@example.com
                        // trim removes white spaces like " abc@example.com    " to "abc@example.com"
                        const isDuplicate = await User.findOne({ email: email })
                        /* if theres no user with the entered email, isDuplicate will be false(null)
                         otherwise if user with the entered email exists in the db, isDuplicate will have true value! */
                        //  console.log(isDuplicate)

                        if (isDuplicate) {
                                // status 409 is used for conflict (in this case, duplicate records (email))
                                return res.status(409).json({ msg: 'This email is taken, try another one.', status: false });

                        }
                        else {
                                // const hashedPassword= await bcrypt.hash(password,10); //hash password with 10 salt rounds
                                // I'LL NOT TRUST USER INPUT AT ALL , VALIDATE CREDENTIALS AGAIN!!!
                                // LOGIC OF VALIDATION IS SAME AS IN FRONTEND!

                                const validated = ValidateSignUP_Input(email, password, confirmed_password);
                                if (validated.status === false) {
                                        return res.status(400).json({ msg: validated.msg, status: false })

                                }

                                if (validated.status === true) {
                                        // Everything looks good, input validation passed!, so lets insert the user!
                                        const hashedPassword = await bcrypt.hash(password, 10);

                                        const isInserted = await User.create({ email: email, password: hashedPassword });
                                        /* if isInserted is true (not null), it means user has been inserted 
                                         * if its null, it means request failed, but i dont know why it failed because
                                         * all checks are verified, so i sent an internal server error in the CATCH BLOCK */
                                        if (isInserted) {
                                                // SEND A WELCOME EMAIL:
                                                SEND_WELCOME_EMAIL(email)
                                                return res.status(200).json({ msg: 'User added Successfully!', status: true });
                                        }





                                }










                        }





                }

                catch (err) {

                        console.error(err.message);
                        return res.status(500).json({ msg: 'Error adding User!', status: false });

                }


        })

}


SIGN_UP();







function LOG_IN() {
        router.post('/login', async (req, res) => {

                try {

                        let { email, password } = req.body;
                        email = email.trim().toLowerCase();
                        const validated = ValidateLogin_Input(email, password)

                        // VALIDATING INPUTS:
                        if (validated.status === false) {
                                return res.status(400).json({ msg: validated.msg, status: false });
                        }


                        if (validated.status === true) {
                                // LOGIC FOR SIGNING IN!
                                const FIND_USER = await User.findOne({ email: email });

                                if (!FIND_USER) { //if the entered email doesent exist (means FIND_USER has null value), do this:
                                        return res.status(400).json({ msg: 'User not found!', status: false })
                                }


                                else { //if user exists, do this:
                                        // console.log(FIND_USER.password)
                                        const isMatch = await bcrypt.compare(password, FIND_USER.password)

                                        return isMatch ? res.status(200).json({ msg: 'Login success!', status: true })
                                                : res.status(400).json({ msg: 'Incorrect Password.', status: false })






                                }






                        }

                }

                catch (err) {
                        // IF STILL SOMETHING GOES WRONG RETURN INTERNAL SERVER ERROR HTTP CODE (500) :
                        console.error(err.message)
                        return res.status(500).json({ msg: "Login Failed.Please try again!", status: false })

                }

        });



}



LOG_IN();




function CHANGE_PASSWORD() {
        console.log(process.env.SECRET)
 

        router.put('/change-password-step1',async (req,res)=>{

                // STEP 1: SEND OTP
                // STEP 2: VERIFY OTP THEN UPDATE PASSWORD in same form

                let {email}=req.query;
                email = email.trim().toLowerCase();
                console.log(email)

                // Check if email is a valid email!

               const isValid = CHECK_VALID_EMAIL(email);
               
               if(!isValid){
               return res.status(400).json({msg:"Please enter a valid email address!",status:false});
               }

               // CHECK IF THE USER EVEN EXISTS??

              const isExist= await User.findOne({email:email});

              if(!isExist){
                return res.status(400).json({msg:"User not found!",status:false});
              }


               // AS THE EMAIL IS VALID AND EXISTS, NOW WE WILL SEND THE OTP!
               // CONTINUE HERE BY USING SEND_OTP THEN HANDLING REJCTS AND RESOLVES
               // SEND_OTP(email).then(()=>{do something}).catch(err=>{do something})
               // or await SEND_OTP(), if theres an error show You have requested too many otps, please try again in 10 minutes
              

               SEND_OTP(email).then(()=>{ 
                console.log("OTP SENT SUCCESSFULLY")
                const $PAYLOAD={email:email};
                const secret=process.env.SECRET;
                const $token=jwt.sign($PAYLOAD,secret,{expiresIn:'10m'});
                console.log($token)

                // WE WILL SEND JWT TO USER, USER WILL SEND IT BACK IN req.body for 2nd STEP, then we will decode it!
                return res.status(200).json({msg: `We have send an OTP to your email:${email}.Please check your inbox and type it here`,status:true,token:$token});
                   })


                   // try to remove catch

               .catch((err)=>{ return res.status(400).json({msg:" You have requested too many otps, please try again in 10 minutes", status:false})});
                 
                
               
        // TILL HERE, THE OTP HAS BEEN SENT SUCCESSFULLY AND SAVED IN THE DB
        // NOW
               

        });

        router.put('/change-password-step2',async (req,res)=>{

                const {token,otp,new_password}=req.body;
                if(!token || !otp || !new_password){
                        return res.status(400).json({msg:"Please fill in all the fields!",status:false});

                }

                let decoded=null;

                try{
                       
                      decoded= jwt.verify(token,process.env.SECRET);
                        console.log("JWT VERIFICATION SUCCESSFULL",decoded)
                }
                catch(err){
                        console.error(err)
                        return res.status(401).json({msg:"Session expired, please request a new OTP!",status:false});
                }

                // YAY WE GOT THE EMAIL!!!!!
                // IF DECODED IS NULL, IT ONLY MEANS THAT SIGNATURE WAS INVALID, SO DECODING fAILED AND IT WILL RETURN THE PROGRAM FROM CATCH BLOCK
                const email=decoded.email;


                // AS WE GOT THE EMAIL, NOW LETS COMPARE THE OTP!
                
                const isOK= await COMPARE_OTP(email,otp);

                if(!isOK){
                   return res.status(400).json({msg:"The OTP you entered is not correct or expired!",status:false});

                }

                  // AS OTP IS CORRECT, NOW LETS UPDATE USER PASSWORD!
                 // WE WILL HASH THE PASSWORD BEFORE SAVING IT
                 try{
                const hashedPassword= await bcrypt.hash(new_password,10);
                const hasUpdated=await User.findOneAndUpdate({email:email},{$set:{password:hashedPassword}});

                if(hasUpdated){
                        // AS PASSWORD IS UPDATED, NOW DELETE THE OTP!
                        DELETE_OTP(email);
                       return res.status(200).json({msg:"Your password has been updated successfully. You now may return to login page",status:true});
                }

                // THROW AN ERROR IF THE USER PASS STILL NOT UPDATED!
                throw new Error("Error!")

               
                }
                catch(err){
                        res.status(400).json({msg:"There was an error updating your password. Please try again later!",status:false});
                }


                        



              





        });




}






CHANGE_PASSWORD();


module.exports = router;
