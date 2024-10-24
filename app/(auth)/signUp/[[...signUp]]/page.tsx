import { SignUp } from "@clerk/nextjs";

export default function Page()  {
  console.log("Received a request at sign up...")
  return (
    <div className="h-screen grid place-items-center">
      <SignUp />
    </div>
  )
}