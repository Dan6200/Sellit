import { supabase } from '#supabase-config'

export const signInForTesting = async ({ email, password }: any) => {
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
  if (signInError) throw signInError
  return signInData.session?.access_token as string
}
