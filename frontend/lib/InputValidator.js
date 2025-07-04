

export function ValidateLogin_Input(email, password) {

    





    /* regex patterns are used to validate inputs, this ones for email
    can be tested by EmailRegex.test(email) ,if its a valid email, it returns true otherwise false */

    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



    // EMAIL AND PASSWORD CHECK BARRIER!!

    /**** HOW THIS WILL WORK:
     * IF USER ENTERS A BAD EMAIL , return the error "Enter valid email"
     *  IF USER ENTERS A BAD PASSWORD , return the error "Enter valid password"
     * THERE IS NO NEED TO HANDLE A condition if BOTH ERRORS exist simultaneously, 
     * if one thing is not given good it will always give an error AND then exit the program"      
     * ****/

    if (!EmailRegex.test(email)) {   // if email is NOT a valid email , do this:
        const errMsg={msg:"Enter a valid Email!" ,status:false}
        return errMsg;
    }

    if (password === '' || password === null || password === undefined || typeof password !== 'string') {
        /* I created checks for every possibility, also to allow ONLY strings
         , as someone might enter a number */
        const errMsg={msg:"Enter a valid  Password!" ,status:false}
        return errMsg;
    }



    /* THIS WILL EXECUTE ONLY IF THE PROGRAM HASNT RETURNED FROM ANY OF THE ABOVE CHECKS
     * If any of the above conditions are matched, the program exits without returning true
     * So, this return is ONLY and ONLY possible when both inputs are correct */
    const msg={status:true}
    return msg;




}






// VALIDATING SIGNUP INPUTS!!

 export function ValidateSignUP_Input(new_email, new_password,confirmed_password){

    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if (!EmailRegex.test(new_email)) {   // if email is NOT a valid email , do this:
        const errMsg={msg:"Enter a valid Email!" , status:false}
        return errMsg;
    }





    if (new_password === '' || new_password === null || new_password === undefined || typeof new_password !== 'string') {
        /* I created checks for every possibility, also to allow ONLY strings
         , as someone might enter a number */
          const errMsg={msg:"Enter a valid  Password!" , status:false}
        return errMsg;
    }



    
    if(new_password !== confirmed_password){ 
        // if new_password and confirmed_password arent same, return this error
          const errMsg={msg:"Passwords don't match" , status:false}
        return errMsg;
    }



    // function only returns true if it has passed through all of above checks
    const msg={status:true}
    return msg;







}



// console.log(ValidateSignUP_Input('a@example.com','pass', 'pass'))
// console.log(ValidateSignin_Input('a@example.com','pass'))


