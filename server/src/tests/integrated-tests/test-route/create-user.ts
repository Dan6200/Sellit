import { supabase } from '#supabase-config'

export const createUserAndSignInForTesting = async ({
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
  if (error)
    throw new Error('Unable to create user: ' + email + '\n\t' + error.cause)
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
  if (signInError) throw signInError
  return signInData.session?.access_token as string
}
