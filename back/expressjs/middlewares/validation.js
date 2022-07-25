import Joi from "joi";

const registerValidation = async function (req, res, next) {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    password: Joi.string().min(4).required(),
  });

  try {
    await schema.validateAsync(body);
  } catch (error) {
    return res.status(400).json({ code: 400, message: error.message });
  }
  next();
};

const loginValidation = async function (req, res, next) {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  });

  try {
    await schema.validateAsync(body);
  } catch (error) {
    return res.status(400).json({ code: 400, message: error.message });
  }
  next();
};

export { registerValidation, loginValidation };
