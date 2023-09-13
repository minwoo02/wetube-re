//- server 관련 코드만 처리

import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

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
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id} ${req.session.potato}`);
});
//세션은 서버가 만들어서 제공해주다보니 서버가 재부팅되면 초기화 된다. (그래서 DB에 저장해서 관리를 한다는 소리. 실 운영에선 서버가 꺼지는 일은 없으니깐.) 세션의 값은 서버가 만들어주는 고유값이다보니 해당 값을 기준으로 클라이언트에서 요청한 건에 대해 유저를 특정지을 수 있다

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
