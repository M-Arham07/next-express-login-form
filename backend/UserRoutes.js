const mongoose=require('mongoose');


const express=require('express');
const router=express.Router();

const User=require('./UserModel');
const {ValidateLogin_Input,ValidateSignUP_Input}=require('../InputValidator');
const bcrypt=require('bcrypt');

// LISTING ALL USERS:
// router.get('/', async (req,res)=>{ 
//  const data= await User.find({})
//  res.json(data);
// });


//SIGN_UP ROUTE
router.post('/sign-up',async (req,res)=>{
    const {email,password,confirmed_password}=req.body; // now email, password and confimed_password are separate variables by object destructring
     
    const isDuplicate= await User.findOne({email:email})
    /* if theres no user with the entered email, isDuplicate will be false(null)
     otherwise if user with the entered email exists in the db, isDuplicate will have true value! */
    //  console.log(isDuplicate)

    if(isDuplicate){
        // status 409 is used for conflict (in this case, duplicate records (email))
       return res.status(409).json({msg:'This email is taken, try another one.',status:false});
        
    }
    else{
        // const hashedPassword= await bcrypt.hash(password,10); //hash password with 10 salt rounds
        // I'LL NOT TRUST USER INPUT AT ALL , VALIDATE CREDENTIALS AGAIN!!!
        // LOGIC OF VALIDATION IS SAME AS IN FRONTEND!

        const validated=ValidateSignUP_Input(email,password,confirmed_password);
        if(validated.status === false){
            return res.status(400).json({msg:validated.msg, status:false})

        }

        if(validated.status === true){
            // Everything looks good, input validation passed!, so lets insert the user!
            const hashedPassword= await bcrypt.hash(password,10);
            const isInserted= await User.insertOne({email:email, password:hashedPassword});

            /* if isInserted is true (not null), it means user has been inserted 
             * if its null, it means request failed, but i dont know why it failed because
             * all checks are verified, so i sent an internal server error (HTTP status:500) */
           return isInserted ? res.status(200).json({msg:'User added Successfully!', status:true})
            : res.status(500).json({msg:'Error adding User!', status:true});

           

        }

    








    }
     
    




})









module.exports=router;
