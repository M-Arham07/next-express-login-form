"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState } from "react";

//INPUT VALIDATOR:
import { ValidateLogin_Input } from '@/lib/InputValidator';




//=============MAIN==============\\


// Eye (open) icon SVG (used)
const EyeOpenIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
  </svg>
);
// Eye (closed) icon SVG (not used)
const EyeClosedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function LoginForm() {



  const [CurrentEyeOpen, setCurrentEyeOpen] = useState(true);

  // FORM INPUT READING
  const [currentPass, setPass] = useState('');
  const [currentEmail, setEmail] = useState('');
  const [ErrData, setErrData] = useState({ errclass: 'hidden', errmsg: '' });




  function HandeShowHidePassword() {
    CurrentEyeOpen ? setCurrentEyeOpen(false) : setCurrentEyeOpen(true);

  }


  useEffect(() => {
    /* removes the error message after 2 seconds, 
   if the signup/signup is pressed before 2 seconds again, react cleanups by executing the return function,
   which clears the timeout, as a result every time signin/signup is pressed , its timer resets to 2seconds */
    const $ERR_TIMEOUT = setTimeout(() => {
      setErrData({ errclass: 'hidden', errmsg: '' })
    }, 2000)
    return () => clearTimeout($ERR_TIMEOUT)
  }, [ErrData])



  function handleLogin(SubmitEvent) {
    SubmitEvent.preventDefault() //prevents default behaviour of forms (reloading)

    // console.log(currentEmail)
    // console.log(currentPass)
    //INPUT VALIDATING


    const validation = ValidateLogin_Input(currentEmail, currentPass)
    //the return value of this function is stored in validated,  Code: console.log(validated)

    if (validation.status === false) {
      setErrData({ errclass: '', errmsg: validation.msg });

      return;

    }

    if (validation.status === true) {
      setErrData({ errclass: 'hidden', errmsg: '' });

      // NOW THE BACKEND PART BEGINS, API POST REQUEST WILL BE SENT TO BACKEND

      async function LOGIN_USER() {
        try {
          const res = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: currentEmail,
              password: currentPass
            })
          });
          const info = await res.json();
          // console.log(info)

          info.status ? setErrData({ errclass: '!text-green-500', errmsg: info.msg })
            : setErrData({ errclass: '', errmsg: info.msg })

        }
        catch (err) {

          console.log(`Failed Connecting to server. Logs: ${err.message}`);
          // also send some error to user
          setErrData({ errclass: '', errmsg: 'Server down. Please try again later.' })


        }

      }

      LOGIN_USER();



    }

  }


  //DEBUGGING:
  // useEffect(()=>{
  //  console.log(ErrData)
  // },[ErrData])













  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link"><Link href='/signup'> Sign Up </Link></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id='login-form' onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">

              {/* Error message*/}
              <div className={`mb-2 ${ErrData.errclass}`}>
                <span className={`block text-red-500 ${ErrData.errclass} text-sm font-medium`}>{ErrData.errmsg}</span>
              </div>
              {/* Error message ENDS*/}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required onChange={(e) => { setEmail(e.target.value) }}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Input id="password"
                    type={CurrentEyeOpen ? 'password' : 'text'}
                    placeholder='Password' required className="pr-8"
                    onChange={(e) => { setPass(e.target.value) }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Show/hide password"
                    onClick={HandeShowHidePassword}
                  >
                    {CurrentEyeOpen ? EyeOpenIcon : EyeClosedIcon}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form='login-form'>  {/* form =login-form IS USED TO LINK the button to the form, as the button is outside the form tag */}

            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )


}

