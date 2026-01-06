import express, { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/:commentId", commentController.getCommentById);

router.get("/author/:authorId", commentController.getCommentByAuthor);

router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment
);

router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.updateComment
);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);

export const commentRouter: Router = router;
