import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUplaod,
  postUpload,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUplaod).post(postUpload);

export default videoRouter;
