"use server";

import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export async function createThread({ text, author, communityId, path}: Params)  {
  connectToDB();

  const createdThread = await Thread.create({
    text,
    author,
    community: null
  })

  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id}
  })

  revalidatePath(path)
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();
  
    // calculate number of posts to skip 
    const skipAmount = (pageNumber - 1) * pageSize; 

    // fetch posts that have no parents (top-level threads)
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
                               .sort({ createdAt: 'desc' })
                               .skip(skipAmount)
                               .limit(pageSize)
                               .populate({ path: 'author', model: User })
                               .populate({
                                  path: "children", // Populate the children field
                                  populate: {
                                    path: "author", // Populate the author field within children
                                    model: User,
                                    select: "_id name parentId image", // Select only _id and username fields of the author
                                  },
                                });

    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}});

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext }
  } catch (error: any) {
    throw new Error(`Error fetching all threads: ${error.message}`)
  }
}

export async function fetchThreadById(id: string)  {
  try {
    connectToDB();
    
    const thread = await Thread.findById(id)
        .populate({
           path: 'author',
           model: User,
           select: "_id id name image"
        })
        .populate({
         path: 'children',
         populate: [
           {
             path: 'author',
             model: User,
             select: "_id id name parentId image"
           },
           {
             path: 'children',
             model: Thread,
             populate: {
               path: 'author',
               model: User,
               select: "_id id name parentId image"
             }
           }
         ]
        }).exec();

    return thread;
  } catch (error: any) {
    console.log(`Error fetching the thread: ${error.message}`)
  }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if(!originalThread)  {
      throw new Error("Thread not found")
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    
    // save the new thread
    const savedCommentThread = await commentThread.save();

    // update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    // save the original thread
    await originalThread.save();

    revalidatePath(path);
    
  } catch (error: any) {
    console.log(`Error adding a comment: ${error.message}`)
  }
}