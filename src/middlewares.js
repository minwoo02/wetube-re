export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  console.log(res.locals);
  next();
};

/*--loggedIn되지 않으면 `/login`으로 redirect, 즉 로그인되어있는 사람만 접근 --*/
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

/*--loggedIn되면 `/`으로 redirect, 즉 로그인된 사람은 `/`으로 리다이렉트 --*/
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};