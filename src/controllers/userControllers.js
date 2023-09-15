import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

/*-----------------------join-----------------------*/
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    User.create({
      name,
      email,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

/*-----------------------login-----------------------*/
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists./",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user; //로그인할때 req.session.user에 입력해준다.
  return res.redirect("/");
};

/*-----------------------github login-----------------------*/
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT, //.env에 저장
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    //Github API와 상호작용 할 때 사용
    const { access_token } = tokenRequest; //access_token은 scope에 적은 내용에 대해서만 허용해준다.
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    } else {
      // 소셜로그인끼리 중복된 이메일을 찾았을 때 에러 처리
      return res.status(400).render("login", {
        pageTitle: "Login",
        errorMessage:
          "This social email is already taken. Please select another social login method.",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

/*-----------------------kakao login-----------------------*/
export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KA_CLIENT,
    redirect_uri: `http://localhost:4000/users/kakao/finish`,
    response_type: "code",
    scope: "profile_nickname,profile_image,account_email",
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseUrl}?${params}`;
  return res.redirect(finalURL);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KA_CLIENT,
    redirect_uri: "http://localhost:4000/users/kakao/finish",
    code: req.query.code,
    client_secret: process.env.KA_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com";
    const userData = await (
      await fetch(`${apiUrl}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    console.log(userData);

    const username = userData.kakao_account.profile.nickname;
    const userEmail = userData.kakao_account.email;

    if (
      !userData.kakao_account.is_email_valid &&
      !userData.kakao_account.is_email_verified
    ) {
      return res.status(400).redirect("/login");
    }
    console.log(userEmail);

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        email: userEmail,
        avatarUrl: userData.kakao_account.profile.profile_image_url,
        username,
        name: username,
        password: "",
        socialOnly: true,
      });
    } else {
      // 소셜로그인끼리 중복된 이메일을 찾았을 때 에러 처리
      return res.status(400).render("login", {
        pageTitle: "Login",
        errorMessage:
          "This social email is already taken. Please select another social login method.",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

/*-----------------------login out----------------------*/
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

/*-----------------------edit profile----------------------*/

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  //code challenge
  const sessionUser = req.session.user;

  if (sessionUser.email !== email && (await User.exists({ email }))) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This email is already taken.",
    });
  }

  if (sessionUser.username !== username && (await User.exists({ username }))) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This username is already taken.",
    });
  }
  //code Challenge/
  const updatedUser = await User.findByIdAndUpdate(
    //User model을 업데이트
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true } //최근 업데이트된 object를 원함. 이전 데이터 말고,
    // req.session.user = {
    //   ...req.session.user,
    //   name,
    //   email,
    //   username,
    //   location
    // }
  );
  req.session.user = updatedUser; //session이 db와 연결돼 있지 않으므로 session 업데이트
  return res.redirect("/users/edit");
};