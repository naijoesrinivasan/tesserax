import { SignIn } from "@clerk/nextjs";

export default function Page()  {
  console.log("Received a request at sign in...")
  return (
    <div className="h-screen grid place-items-center">
      <SignIn /> 
    </div>
  )
}