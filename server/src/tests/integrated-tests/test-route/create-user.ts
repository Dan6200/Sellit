import { supabase } from '#supabase-config'

export const createUserForTesting = async ({
  email,
  password,
  ...user_metadata
}: any) => {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata,
    email_confirm: true,
  })
  if (error) throw new Error('Unable to create user: ' + email + '\n\t' + error)
}
