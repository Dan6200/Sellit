import {
  UIDSchema,
  UserRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
} from '../../app-schema/users.js'

export interface UserData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  password: string
  dob: Date
  country: string
}

export type UserRequestData = UserData & ({ email: string } | { phone: string })

export interface UID {
  uid: string
}

export const isValidUID = (data: unknown): data is UID => {
  const { error } = UIDSchema.validate(data)
  error && console.error(error)
  return !error
}

interface UserResponse extends UserData {
  is_customer: boolean
  is_vendor: boolean
}

export type UserResponseData = UserResponse & UserRequestData

export const isValidUserUpdateRequestData = (
  data: unknown,
): data is UserRequestData => {
  const { error } = UserUpdateRequestSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidUserRequestData = (
  data: unknown,
): data is UserRequestData => {
  // console.log('DEBUG: data ->' + JSON.stringify(data))
  const { error } = UserRequestSchema.validate(data)
  error && console.error('here' + error)
  return !error
}

export const isValidUserResponseData = (
  data: unknown,
): data is UserResponseData => {
  const { error } = UserResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
