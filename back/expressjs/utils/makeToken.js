import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

const makeAccessToken = function (Object) {
  const token = jwt.sign(Object, JWT_KEY, { expiresIn: "1h" });
  return token;
};

const makeRefreshToken = function () {
  // refresh token 발급
  const refreshToken = jwt.sign({}, JWT_KEY, {
    //refresh token은 payload 없이 발급
    algorithm: "HS256",
    expiresIn: "14d",
  });
  return refreshToken;
};

export { makeAccessToken, makeRefreshToken };
