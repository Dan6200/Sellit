// import redis from 'redis'
//
// const client = redis.createClient({
//   url: process.env.REDIS_URL,
// })
//
// client.on('error', (err) => {
//   console.log('Redis Server Error...')
//   console.error(err)
// })
//
// export default {
//   async connect() {
//     if (client.isOpen) return
//     await client.connect()
//   },
//   async quit() {
//     if (client.isOpen) client.quit()
//   },
//   async getClient() {
//     this.connect()
//     return client
//   },
//   async sAdd(key: string, value: string) {
//     this.connect()
//     const retVal = await client.sAdd(key, value)
//     // this.quit()
//     return retVal
//   },
//   async sIsMember(key: string, value: string) {
//     this.connect()
//     const retVal = await client.sIsMember(key, value)
//     // this.quit()
//     return retVal
//   },
// }
