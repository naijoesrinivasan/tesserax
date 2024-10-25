// Resource: https://docs.uploadthing.com/nextjs/appdir#creating-your-first-fileroute
// Above resource shows how to setup uploadthing. Copy paste most of it as it is.
// We're changing a few things in the middleware and configs of the file upload i.e., "media", "maxFileCount"
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } }, { awaitServerData: true },)
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      // console.log("Upload Thing middleware: ", req, typeof req)
      const user = await currentUser();
      
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("You must be logged in to upload a profile picture");

      // What ever is returned here is accessible in onUploadComplete as `metadata`
      return {files: req.files}
    })
    .onUploadComplete(({ metadata, file }) => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;