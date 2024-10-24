import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      const user = await currentUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async (res) => {
      // This code RUNS ON YOUR SERVER after upload
      const data = JSON.stringify(res);
      console.log("Upload complete for userId:", data);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return res;
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;