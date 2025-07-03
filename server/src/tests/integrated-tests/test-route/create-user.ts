import { supabase } from '#supabase-config'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'

export const createUserAndSignInForTesting = async ({ verb, path, ...body }: any) => {
  const { email, password, ...user_metadata } = body as UserRequestData
  // Create user for testing
  if (verb === 'post' && path === '/v1/users') {
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
}
