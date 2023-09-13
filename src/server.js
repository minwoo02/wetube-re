//- server 관련 코드만 처리

import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug"); //현재 작업 디렉토리에서, express가 views 디렉토리에서 pug파일을 찾도록 설정
app.set("views", process.cwd() + "/src/views"); //views 경로지정, express 랜더링
app.use(express.urlencoded({ extended: true })); //express application이 form의 value를 이해할 수 있도록

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/wetube-re",
    }),
  })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
