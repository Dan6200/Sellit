// Orphaned...No longer implementing my own Auth
// import client from '../../db/redis/index.js'
// // Add a token to the list of revoked tokens
// export async function revokeToken(token: string) {
// 	await client.sAdd('revoked_tokens', token)
// }
//
// // Check if a token has been revoked
// export async function isTokenRevoked(token: string) {
// 	return client.sIsMember('revoked_tokens', token)
// }
