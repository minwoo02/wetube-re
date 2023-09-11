import express from "express";
import { join } from "../controllers/userControllers";
import { home, search } from "../controllers/videoControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/search", search);

export default globalRouter;
