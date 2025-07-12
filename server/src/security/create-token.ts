/* NO LONGER USING MY OWN AUTH!!! */
// import jwt, { Secret } from 'jsonwebtoken'

// // TODO: Optimization, is this faster sync or async
// export const createToken = function (
// 	userId: string,
// 	callback: (token: string) => void
// ): void {
// 	jwt.sign(
// 		{ userId },
// 		process.env.JWT_SECRET as Secret,
// 		{
// 			expiresIn: process.env.JWT_LIFETIME,
// 		},
// 		(err, _token) => {
// 			if (err) throw err
// 			callback(_token as string)
// 		}
// 	)
// }

// TODO: Optimization, is this faster sync or async
// export const createToken = function (userId: string): string {
// 	return jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
// 		expiresIn: process.env.JWT_LIFETIME,
// 	})
// }
