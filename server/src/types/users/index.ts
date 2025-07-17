// import { ProfileIDSchema } from '../../app-schema/users.js'

export interface ProfileData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  password?: string
  dob: Date
  country: string
  is_customer: boolean
  is_vendor: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

export type ProfileRequestData = ProfileData &
  ({ email: string } | { phone: string })

export interface ProfileID {
  userId: string
}

// orphaned...
// export const isValidProfileID = (data: unknown): data is ProfileID => {
//   const { error } = ProfileIDSchema.validate(data)
//   error && console.error(error)
//   return !error
// }
