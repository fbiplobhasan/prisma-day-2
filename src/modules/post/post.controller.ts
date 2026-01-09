import { NextFunction, Request, Response } from "express";
import { postService } from "./post.sevice";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    next(error);
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortOrder,
      sortBy,
    });

    return res.status(200).json({ result });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }
    const result = await postService.getPostById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed.",
      details: error,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string } | undefined;

    if (!user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await postService.getMyPost(user.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Post fetch failed",
    });
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as { id: string; role: UserRole } | undefined;

    if (!user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    console.log(user);
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Post delete failed.",
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Stats fetch failed.",
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats,
};
