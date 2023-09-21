//- server 관련 코드만 처리

import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug"); //현재 작업 디렉토리에서, express가 views 디렉토리에서 pug파일을 찾도록 설정
app.set("views", process.cwd() + "/src/views"); //views 경로지정, express 랜더링
app.use(express.urlencoded({ extended: true })); //express application이 form의 value를 이해할 수 있도록

app.use(
  session({
    secret: process.env.COOKIE_SECRET, //세션 쿠키에 사용되는 비밀번호이다. 이 값은 서버 측에서 쿠키를 검증하는 데 사용된다.
    resave: false,
    saveUninitialized: false, //false => 세션이 수정, 초기화될 때만, 세션을 DB에 저장, 쿠키를 넘겨줌
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //uploads 폴더를 주소에 노출
app.use("/static", express.static("assets")); //webpack에서 처리된 파일을 주소에 노출
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
