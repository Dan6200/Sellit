import { ProfileResponseSchema } from '#src/app-schema/users.js'
import { ProfileData } from '#src/types/users/index.js'

export type ProfileRequestData = ProfileData &
  ({ email: string } | { phone: string })

// orphaned...
// export const isValidProfileUpdateRequestData = (
//   data: unknown,
// ): data is ProfileRequestData => {
//   const { error } = ProfileUpdateRequestSchema.validate(data)
//   error && console.error(error)
//   return !error
// }

// orphaned...
// export const isValidProfileRequestData = (
//   data: unknown,
// ): data is ProfileRequestData => {
//   const { error } = ProfileRequestSchema.validate(data)
//   error && console.error(error)
//   return !error
// }

interface ProfileResponse extends ProfileData {
  is_customer: boolean
  is_vendor: boolean
}

export type ProfileResponseData = ProfileResponse & ProfileRequestData

export const isValidProfileResponseData = (
  data: unknown,
): data is ProfileResponseData => {
  const { error } = ProfileResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
