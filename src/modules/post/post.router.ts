import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPost
);

router.get("/stats", auth(UserRole.ADMIN), postController.getStats);

router.get("/:id", postController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.deletePost
);

export const postRouter: Router = router;
