import { UserResponseSchema } from '#src/app-schema/users.js'
import { UserData } from '#src/types/users/index.js'

export type UserRequestData = UserData & ({ email: string } | { phone: string })

// orphaned...
// export const isValidUserUpdateRequestData = (
//   data: unknown,
// ): data is UserRequestData => {
//   const { error } = UserUpdateRequestSchema.validate(data)
//   error && console.error(error)
//   return !error
// }

// orphaned...
// export const isValidUserRequestData = (
//   data: unknown,
// ): data is UserRequestData => {
//   const { error } = UserRequestSchema.validate(data)
//   error && console.error(error)
//   return !error
// }

interface UserResponse extends UserData {
  is_customer: boolean
  is_vendor: boolean
}

export type UserResponseData = UserResponse & UserRequestData

export const isValidUserResponseData = (
  data: unknown,
): data is UserResponseData => {
  const { error } = UserResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
