// import UnauthorizedError from '../../../errors/unauthorized.js'
//
// export async function createUserWithEmailAndPasswordWrapper({
//   email,
//   password,
// }: {
//   email: string
//   password: string
// }) {
//   return createUserWithEmailAndPassword(auth, email, password)
//     .then(({ user }: UserCredential) => user.getIdToken())
//     .catch((error) => {
//       console.error(error)
//       throw new UnauthorizedError('Could not Authenticate user')
//     })
// }
