import { UserData } from './index.js'
import joi from 'joi'

type signInInfo = UserData & ({ email: string } | { phone: string })

export const SignInInfoSchema = joi
  .object({
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
      ),
    password: joi.string(),
  })
  .or('email', 'phone')
  .required()

export const isValidSignInInfo = (data: unknown): data is signInInfo => {
  const { error } = SignInInfoSchema.validate(data)
  error && console.error(error)
  return !error
}
