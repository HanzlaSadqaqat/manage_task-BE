import Joi from "joi";
import { taskDocument } from "../models/TaskModel";

export const taskValidation = (data: taskDocument): Joi.ValidationResult =>
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    email: Joi.string().email(),
  }).validate(data);
export const updateValidation = (data: taskDocument): Joi.ValidationResult =>
  Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    id: Joi.string(),
  }).validate(data);
