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
  const INPUT_EMAIL_FORM=  
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
  const[InputFormShow,setInputFormShow]=useState(true)

  


  // For custom error
  const { setError } = form;

  function onSubmit(data) {
    // by defualt, this form prevents default e.preventDefault();
    // Example: Simulate backend check for email
    // We will use JSON repsponse in real life
    if (data.email === "blocked@example.com") {
      setError("email", { type: "manual", message: "This email is blocked. Please use another email." });
      return;
    }
    setInputFormShow(false)
  }

 return InputFormShow ? INPUT_EMAIL_FORM : <OTP_FORM />
}
