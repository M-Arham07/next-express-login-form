"use client";
// IMPORTS
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
import { ValidateSignUP_Input } from '@/lib/InputValidator'




//=============MAIN==============\\










const EyeOpenIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
  </svg>
);

const EyeClosedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
);







export default function SignupForm() {









  const [CurrentEyeOpen, setCurrentEyeOpen] = useState(true);

  function HandeShowHidePassword() {
    CurrentEyeOpen ? setCurrentEyeOpen(false) : setCurrentEyeOpen(true);

  }

  const [currentEmail, setEmail] = useState('');
  const [currentPass, setPass] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');
  const [ErrData, setErrData] = useState({ errclass: 'hidden', errmsg: '' });


  useEffect(() => {
    /* removes the error message after 2 seconds, 
   if the signup/signup is pressed before 2 seconds again, react cleanups by executing the return function,
   which clears the timeout, as a result every time signin/signup is pressed , its timer resets to 2seconds */
    const $ERR_TIMEOUT = setTimeout(() => {
      setErrData({ errclass: 'hidden', errmsg: '' })
    }, 2000)
    return () => clearTimeout($ERR_TIMEOUT)
  }, [ErrData])

  function handleSignup(SubmitEvent) {
    SubmitEvent.preventDefault();

    const validation = ValidateSignUP_Input(currentEmail, currentPass, confirmedPass);



    if (validation.status === false) {
      setErrData({ errclass: '', errmsg: validation.msg })
      //REMOVE ERROR MESSAGE AFTER 2 SECONDS!

      return; //exit
    }


    if (validation.status === true) {
      setErrData({ errclass: 'hidden', errmsg: '' })


      // TO BE CONTINUED AFTER BACKEND BUILT!

    }









  }






  // FOR DEBUGGING:
  //  useEffect(()=>{
  //   console.log(`
  //     ${currentEmail}
  //     ${currentPass}
  //     ${confirmedPass}
  //     `)
  // },[currentEmail,currentPass,confirmedPass])
















  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
          <CardAction>
            <Button variant="link"><Link href="/login"> Login </Link></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              {/* Error message  */}
              <div className={`mb-2 ${ErrData.errclass}`}>
                <span className="block text-red-500 text-sm font-medium">{ErrData.errmsg}</span>
              </div>
              {/* Error message ENDS */}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center">
                  <Input id="password" minLength='8'
                    type={CurrentEyeOpen ? 'password' : 'text'}
                    required className="pr-8" onChange={(e) => setPass(e.target.value)} />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Show/hide password" onClick={HandeShowHidePassword}
                  >
                    {CurrentEyeOpen ? EyeOpenIcon : EyeClosedIcon}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative flex items-center">
                  <Input id="confirm-password" minLength='8'
                    type={CurrentEyeOpen ? 'password' : 'text'}
                    required className="pr-8" onChange={(e) => setConfirmedPass(e.target.value)} />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Show/hide password" onClick={HandeShowHidePassword}
                  >
                    {CurrentEyeOpen ? EyeOpenIcon : EyeClosedIcon}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form="signup-form">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
