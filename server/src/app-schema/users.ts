// Purpose: Joi schema for account data
// cspell:ignore alphanum
import joi from 'joi'

export const UserRequestSchema = joi
  .object()
  .keys({
    first_name: joi.string().alphanum().min(3).max(30).required(),
    last_name: joi.string().alphanum().min(3).max(30).required(),
    email: joi
      .string()
      .pattern(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .allow(null),
    phone: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      )
      .allow(null),
    // password: joi.string(),
    dob: joi.date().required(),
    country: joi.string(),
  })
  .or('email', 'phone')
  .required()
/*
    password: joi
      .string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+\-~^:;`._=\/\\{}\[\]\(\)])[A-Za-z\s\d!@#$%^&*+\-~^_:;`.=\/\\{}\[\]\(\)]{8,}$/
      ),*/

export const UserResponseSchema = joi
  .object()
  .keys({
    first_name: joi.string().alphanum().min(3).max(30).required(),
    last_name: joi.string().alphanum().min(3).max(30).required(),
    email: joi
      .string()
      .pattern(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .allow(null),
    phone: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      )
      .allow(null),
    dob: joi.alternatives().try(joi.date().required(), joi.string().required()),
    country: joi.string(),
    is_customer: joi.boolean().required(),
    is_vendor: joi.boolean().required(),
  })
  .or('email', 'phone')
  .required()

export const UserUpdateRequestSchema = joi
  .object({
    first_name: joi.string().alphanum().min(3).max(30),
    last_name: joi.string().alphanum().min(3).max(30),
    email: joi
      .string()
      .pattern(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .allow(null),
    phone: joi
      .string()
      .pattern(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      )
      .allow(null),
    dob: joi.alternatives().try(joi.date(), joi.string()),
    country: joi.string(),
  })
  .required()

export const UIDSchema = joi
  .object({
    uid: joi.string().alphanum().min(1).max(128),
  })
  .required()
