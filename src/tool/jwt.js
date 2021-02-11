const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "default_token_key";

function decode(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        rej(err);
      }
      res(decoded);
    });
  });
}

module.exports = { decode };
