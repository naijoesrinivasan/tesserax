import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/api/uploadthing', '/api/webhook/clerk', '/signIn(.*)', '/signUp(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // console.log("Middleware request: ", req)
  if (!isPublicRoute(req))  {
    // console.log("Unauthorized path. Protecting route...")
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};