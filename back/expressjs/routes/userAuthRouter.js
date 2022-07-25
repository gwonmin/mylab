import is from "@sindresorhus/is";
import { Router } from "express";
import { registerValidation, loginValidation } from "../middlewares/validation";
import { userAuthService } from "../services/userAuthService";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import { verifyRefresh } from "../middlewares/verifyRefreshToken";

const userAuthRouter = Router();

userAuthRouter.post(
  "/register",
  registerValidation,
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request) 에서 데이터 가져오기
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const email = req.body.email;
      const password = req.body.password;

      // 위 데이터를 유저 db에 추가하기
      const newUser = await userAuthService.addUser({
        first_name,
        last_name,
        email,
        password,
      });

      if (newUser.errorMessage) {
        throw new Error(newUser.errorMessage);
      }

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.post("/login", loginValidation, async function (req, res, next) {
  try {
    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const user = await userAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/current",
  verifyAccessToken,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.put("/:id", verifyAccessToken, async function (req, res, next) {
  try {
    // URI로부터 사용자 id를 추출함.
    const user_id = req.params.id;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const name = req.body.name ?? null;
    const email = req.body.email ?? null;
    const password = req.body.password ?? null;

    const toUpdate = { name, email, password };

    // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
    const updatedUser = await userAuthService.setUser({ user_id, toUpdate });

    if (updatedUser.errorMessage) {
      throw new Error(updatedUser.errorMessage);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get("/:id", verifyAccessToken, async function (req, res, next) {
  try {
    const user_id = req.params.id;
    const currentUserInfo = await userAuthService.getUserInfo({ user_id });

    if (currentUserInfo.errorMessage) {
      throw new Error(currentUserInfo.errorMessage);
    }

    res.status(200).send(currentUserInfo);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.delete("/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await userAuthService.deleteUser({ id });

    if (deletedUser.errorMessage) {
      throw new Error(updatedUser.errorMessage);
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

/* access token을 재발급 하기 위한 router.
  access token과 refresh token을 둘 다 헤더에 담아서 요청해야함 */
userAuthRouter.get("/refresh", verifyRefresh);

module.exports = userAuthRouter;
