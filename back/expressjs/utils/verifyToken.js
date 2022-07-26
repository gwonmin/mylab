import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from "./redis";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

// access token 유효성 검사
const verifyAccessToken = function (token) {
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    return {
      ok: true,
      userId: decoded.userId,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

// refresh token 유효성 검사
const verifyRefreshToken = async function (token, userId) {
  // redis 서버에서 refreshToken값을 가져오기 위한 async function
  async function getVal(key) {
    return await redisClient.get(key);
  }

  try {
    const refreshToken = await getVal(userId);
    if (token === refreshToken) {
      try {
        jwt.verify(token, JWT_KEY);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export { verifyAccessToken, verifyRefreshToken };
