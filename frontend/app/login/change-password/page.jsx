"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})



import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react"
import OTP_FORM from "./otp-form"

export default function CHANGE_PASSWORD() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })


  // INPUT EMAIL FORM!:
  const INPUT_EMAIL_FORM =
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
          <CardAction>
            <Button variant="link"><Link href="/login">Back to Login</Link></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll never share your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>



  // USE STATES:
  const [InputFormShow, setInputFormShow] = useState(true)
  const [Token, setToken] = useState(null)




  // For custom error
  const { setError } = form;

  async function onSubmit(info) {


    // this form prevents default automatically e.preventDefault()
    // setError("email", { type: "manual", message: "This email is blocked. Please use another email." });
    try {
      const email = info.email;
      //DEBUGGING: console.log(encodeURIComponent(email))

      const res = await fetch(`http://localhost:4000/api/change-password-step1?email=${encodeURIComponent(email)}`, {
        method: 'PUT',
      });
     
      const data=await res.json();
      // console.log(data)

      if(data.status === false){
         setError("email", { type: "manual", message: data.msg });
        return;
      }
      
      // as it has passed false check, so do this:
      // console.log(data)
      const {token}=data; //ill not use the message sent from backend as we will only show input form if otp has been sent

      setToken(token);
      // console.log(token)
      setInputFormShow(false)
    }



    catch (err) {
      console.log("FAILED TO FETCH, SERVER DOWN PLZ TRY AGAIN LATER", err)
      setError("email", { type: "manual", message: "Server down! Please try again later." });
      return;
    }






  }

  return InputFormShow ? INPUT_EMAIL_FORM : <OTP_FORM token={Token} /> //pass the token as props!
}
