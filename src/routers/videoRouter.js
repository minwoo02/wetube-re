import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUplaod,
  postUpload,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUplaod).post(postUpload);

export default videoRouter;
