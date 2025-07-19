import { supabase } from '#supabase-config'
import { knex } from '#src/db/index.js'

export const deleteUserForTesting = async (userId: string) => {
  if (!!userId) {
    // Hard delete from public.users table using Knex
    await knex('profiles')
      .where('id', userId)
      .del()
      .catch((deleteError: Error) =>
        console.error(
          `Failed to hard delete user from public.users with userId ${userId}: ${deleteError}`,
        ),
      )

    // Delete from Supabase auth.users
    await supabase.auth.admin
      .deleteUser(userId)
      .catch((deleteError: Error) =>
        console.error(
          `Failed to delete user from Supabase auth with userId ${userId}: ${deleteError}`,
        ),
      )
    process.env.DEBUG &&
      console.log(`Deleted user with ID: ${userId} from Supabase auth.`)
  } else {
    process.env.DEBUG &&
      console.log(
        `Could not delete user with ID: ${userId} from Supabase auth.`,
      )
  }
}
