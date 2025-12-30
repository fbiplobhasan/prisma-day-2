import { Request, Response } from "express";
import { postService } from "./post.sevice";

const createPost = async (req: Request, res: Response) => {
  try {
    // console.log(req.user);

    const user = req.user;
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await postService.createPost(req.body, user?.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed.",
      details: error,
    });
  }
};

export const postController = {
  createPost,
};
