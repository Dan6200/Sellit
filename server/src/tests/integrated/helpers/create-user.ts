import { supabase } from '#supabase-config'

export const createUserForTesting = async ({
  email,
  password,
  phone, // Extract phone explicitly
  ...user_metadata // Collect remaining into user_metadata
}: any) => {
  if (process.env.DEBUG)
    console.log(
      `\nDEBUG: Create User -> ` +
        JSON.stringify({ email, password, phone, user_metadata }), // Log phone as well
    )
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    phone, // Pass phone as a top-level argument
    user_metadata, // Pass the remaining user_metadata
    email_confirm: true,
  })
  if (error)
    throw new Error(
      'Unable to create user: ' + email + '\n\t' + JSON.stringify(error),
    )
  return data.user?.id
}
