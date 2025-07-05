import { supabase } from '#supabase-config'

export const deleteAllUsersForTesting = async () => {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error('Failed to list users:', error)
    return
  }

  if (data && data.users.length > 0) {
    for (const user of data.users) {
      await supabase.auth.admin
        .deleteUser(user.id)
        .catch((deleteError: Error) =>
          console.error(
            `Failed to delete user with uid ${user.id}: ${deleteError}`,
          ),
        )
    }
    // console.log(`Deleted ${data.users.length} users from Supabase auth.`)
  } else {
    // console.log('No users to delete from Supabase auth.')
  }
}
