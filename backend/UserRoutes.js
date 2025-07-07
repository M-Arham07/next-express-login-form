const mongoose = require('mongoose');


const express = require('express');
const router = express.Router();

const User = require('./UserModel');
const { ValidateLogin_Input, ValidateSignUP_Input, CHECK_VALID_EMAIL } = require('./utilities/InputValidatorBACKEND');
const bcrypt = require('bcrypt');

// Welcome Email sender after user logs in and OTP SENDER!
const { SEND_WELCOME_EMAIL, SEND_OTP, COMPARE_OTP } = require('./utilities/EMAIL_SYSTEM')

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






        router.put('/change-password-step1', async (req, res, next) => {

                const { email } = req.query;

                const isValidEmail = CHECK_VALID_EMAIL(email);

                if (!isValidEmail) {
                        return res.status(400).json({ msg: "Please enter a valid email address!",status:false });
                        // if it isnt a valid email it will automatically exit so no if else things
                }

                try {
                        const info = await User.findOne({ email: email });

                        if (!info) {
                                return res.status(400).json({ msg: "User not found!",status:false })
                        }

                        // console.log(info)
                        // ATTACH info to request, then pass control to next middleware/handler
                        // can be accessed by other middelwares using req.INFO
                        req.INFO = info;
                        if(req.body.USER_OTP){ // if req.body.USER_OTP exists, only then pass control to next middleware
                        return next();
                        }

                }

                catch (err) {
                        // IF THERES ANY ERROR DO THIS!:
                        console.error(err);
                        return res.status(500).json({ msg: "Server Down. Please try again later.",status:false })
                }







        });

        router.put('/change-password-step2', async (req, res, next) => {



                try {
                        // DEBUGGING: console.log("hi from verify otp",req.INFO); next();
                        const { email } = req.INFO; //DEBUGGING: console.log(email)
                        const { USER_OTP } = req.body; // user entered otp



                        const isOTPSent = await SEND_OTP(email); // console.log(isOTPSent) will give an object with otp and status

                        if (isOTPSent.sent === true) {
                                const { otp } = isOTPSent;
                                //console.log(isOTPSent.otp) will show the otp that's sent to user 
                                const isValid = await COMPARE_OTP(email, USER_OTP);
                                if (!isValid) {
                                        return res.status(400).json({ msg: "Invalid or expired OTP! Please reload the page and request a new one.",status:false })
                                }
                                //else:

                                return next();


                        }
                        else {
                                console.log("OTP SENDING FAILED")
                                return res.status(500).json({ msg: "There was an error sending OTP! Please refresh this page" ,status:false})

                        }





                }
                catch (err) {
                        console.log(err)
                        return res.status(500).json({ msg: "Server Down! Please try again later",status:false })
                }


        });

        router.put('/change-password-step3', async (req, res) => {
                const { email } = req.INFO
                const { new_password } = req.body;
                new_password = await bcrypt.hash(new_password, 10); // hash the new_password
                const info = await User.findOneAndUpdate({ email: email }, { $set: { password: new_password } });
                
                if(info){
                return res.status(200).json({msg:"Your password has been updated successfully! You now may return to the login page.",status:true})
                }
                else{
                        return res.status(500).json({msg:'Server Down, please try again later.',status:false});
                }



        });





}






CHANGE_PASSWORD();


module.exports = router;
