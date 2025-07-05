
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mongoSanitize=require('express-mongo-sanitize'); // USED TO SANITIZE NoSQL queries to avoid injections
dotenv.config(); //allows to use process.env.variable_name




const app = express();
mongoose.Promise=global.Promise;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// CONNECTING TO MONGODB DATABASE

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to database successfully")


    }
    catch(err){
        console.log("Connection to database failed!")

    }

}

ConnectDB();


app.use((req,res,next)=>{ 

/* THIS MIDDLEWARE WILL FIRST SANITIZE req.body, remove $ . 
 * and other prohibited characters that might cause an issue!
 * and only then it will pass control to next middleware! */

//  req.params = mongoSanitize.sanitize(req.params)

 req.body = mongoSanitize.sanitize(req.body); 

 next();
});


// IMPORTING ROUTES AND USING THEM:
const UserRoutes=require('../backend/UserRoutes');
app.use('/api',UserRoutes);


app.use((req,res,next)=>{
    res.status(404).send('404 Not found!')

});


app.use((err,req,res,next)=>{
    const $ERR_CODE=err.statusCode || 500; // if theres no status code, assign it 500 (Internal Server Error)
    res.status($ERR_CODE).json({msg: `There was an error processing your reqeust, try later ${err.message}.`,status:false});
})


app.listen(process.env.PORT,()=>{
  console.log(`Server running at localhost:${process.env.PORT} `)
});

