import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyAccessToken = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "fail",
        mesage: "token이 없습니다.",
      });
    } else {
      const JWT_KEY = process.env.JWT_SECRET_KEY;
      const token = String(req.headers.authorization.split(" ")[1]);
      const decoded = jwt.verify(token, JWT_KEY);
      req.currentUserId = decoded.userId;
      next();
    }
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "token이 변형되었습니다.",
      error,
    });
    next(error);
  }
};

export { verifyAccessToken };
