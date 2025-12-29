import express, { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

const auth = (...role: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log("middleware checker...", role);
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    console.log(session)
  };
};

router.post("/", auth("Admin", "User"), postController.createPost);

export const postRouter: Router = router;
