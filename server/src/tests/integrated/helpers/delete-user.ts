import { supabase } from '#supabase-config'
import { knex } from '#src/db/index.js'

export const deleteAllUsersForTesting = async () => {
  const { data, error } = await supabase.auth.admin.listUsers()
  process.env.DEBUG &&
    console.log('\nDEBUG: Users to be deleted -> ' + JSON.stringify(data))
  if (error) {
    console.error('Failed to list users:', error)
    return
  }

  if (data && data.users.length > 0) {
    for (const user of data.users) {
      // Hard delete from public.users table using Knex
      await knex('profiles')
        .where('id', user.id)
        .del()
        .catch((deleteError: Error) =>
          console.error(
            `Failed to hard delete user from public.users with userId ${user.id}: ${deleteError}`,
          ),
        )

      // Delete from Supabase auth.users
      await supabase.auth.admin
        .deleteUser(user.id)
        .catch((deleteError: Error) =>
          console.error(
            `Failed to delete user from Supabase auth with userId ${user.id}: ${deleteError}`,
          ),
        )
    }
    process.env.DEBUG &&
      console.log(`Deleted ${data.users.length} users from Supabase auth.`)
  } else {
    process.env.DEBUG && console.log('No users to delete from Supabase auth.')
  }
}
