import Joi from "joi";
import { LoginPayload, SignupPayload } from "src/models/User";
export const signUpValidation = (data: SignupPayload): Joi.ValidationResult =>
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(18),
    conformPassword: Joi.string().required().min(8).max(18),
  }).validate(data);

export const loginValidation = (data: LoginPayload): Joi.ValidationResult =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(18),
  }).validate(data);
