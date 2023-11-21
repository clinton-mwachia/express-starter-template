const { expressjwt: jwt } = require("express-jwt");

function auth() {
  const secret = process.env.SECRET;
  const API = process.env.API;
  return jwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      `${API}/`,
      `${API}/user/login`,
      `${API}/user/login/`,
      `${API}/user/register`,
      `${API}/user/register/`,
    ],
  });
}

module.exports = auth;
