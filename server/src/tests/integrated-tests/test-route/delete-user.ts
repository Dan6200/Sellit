import { supabase } from '#supabase-config'
import BadRequestError from '../../../errors/bad-request.js'

export const deleteUser = async ({ uid }: { uid: string }) => {
  if (!uid)
    throw new BadRequestError('Must provide UID for the user to be deleted')
  await supabase.auth.admin.deleteUser(uid)
  // .catch((error: Error) =>
  //   console.error(`failed to delete user with uid ${uid}: ${error}`)
  // )
}
