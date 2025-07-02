/* NO LONGER USING MY OWN AUTH!!! */
// import bcrypt from 'bcryptjs'
//
// const hashPassword = async (password: string): Promise<string> => {
// 	const salt: string = await bcrypt.genSalt()
// 	return bcrypt.hash(password, salt)
// }
//
// const validatePassword = async function (
// 	candidatePassword: string,
// 	storedPassword: string
// ): Promise<boolean> {
// 	return bcrypt.compare(candidatePassword, storedPassword)
// }
//
// export { hashPassword, validatePassword }
