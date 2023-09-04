export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const watch = (req, res) =>
  res.render("watch", { pageTitle: "Watch Video" });
export const edit = (req, res) => res.send("Edit");
