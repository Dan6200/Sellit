// import { UserIDSchema } from '../../app-schema/users.js'

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

export interface UserID {
  userId: string
}

// orphaned...
// export const isValidUserID = (data: unknown): data is UserID => {
//   const { error } = UserIDSchema.validate(data)
//   error && console.error(error)
//   return !error
// }
