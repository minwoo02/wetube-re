import Video from "../models/Video.js";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}); //db에 Video 파일들을 불러옴
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("server-error"), { error };
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); //db에서 해당 id에 Video 파일을 불러옴, pug 때문
  return res.render("watch", { pageTitle: video.title, video });
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
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  // videoSchema에 있는 내용을 create할 때 작성하지 않으면 error 발생
};
