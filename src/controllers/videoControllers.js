import Video from "../models/Video.js";

/* 방법1: callback
export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    if(error) {
      return res.render("server-error")
    }
    return res.render("home", { pageTitle: "Home", videos });
  });
}; */

// 방법2: promise
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}); //db에 Video 파일들을 불러옴
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("server-error"), { error };
  }
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watch` });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUplaod = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    creadAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  console.log(video);
  // 새로운 video object 생성시, mongoose가 고유 _id를 부여해준다.
  // **JS 내에서만 존재함.**
  const dbVideo = await video.save(); //데이터를 db에 전송하는데 시간이 걸리기 떄문에 await으로 기다려줘야함
  // **db에도 존재함.**
  console.log(dbVideo);
  return res.redirect("/");
};

// Model.create() 사용시 create() 다음 미들웨어인 save()를 트리거.

/* export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  await Video.create({
    title,
    description,
    creadAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  return res.redirect("/");
}; */
