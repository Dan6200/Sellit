import { supabase } from '#supabase-config'

export const signInForTesting = async ({ email, phone, password }: any) => {
  if (process.env.DEBUG) {
    console.log('\nDEBUG: Signup -> ')
    console.log('\tEmail: ' + email)
    console.log('\tPhone: ' + phone)
    console.log('\tPassword: ' + password)
  }

  const credentials: any = { password }
  if (email) {
    credentials.email = email
  } else if (phone) {
    credentials.phone = phone
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword(credentials)
  if (signInError) throw signInError
  return signInData.session?.access_token as string
}
