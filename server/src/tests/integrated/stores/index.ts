// import chai from 'chai'
// import { assert } from 'chai'
// import chaiHttp from 'chai-http'
// import db from '../../../db/index.js'
// import { AccountData } from '../../../types/account.js'
// import { StoresData } from '../../../types/stores-data.js'
// import { registration } from '../helper-functions/auth/index.js'
// import {
//   testCreateStore,
//   testGetStore,
//   testUpdateStore,
//   testDeleteStore,
//   testGetNonExistentStore,
// } from '../helper-functions/store/index.js'
// import {
//   testCreateVendor,
//   testDeleteVendor,
// } from '../helper-functions/vendor/index.js'
//
// chai.use(chaiHttp).should()
//
// const server = process.env.SERVER!
// let token: string
//
// export default function ({
//   accountInfo,
//   stores: listOfStoresByVendor,
//   updatedStores: listOfUpdatedStoresByVendor,
// }: {
//   accountInfo: AccountData
//   stores: StoresData[]
//   updatedStores: StoresData[]
// }) {
//   before(async () => {
//     // Delete user accounts
//     await db.query({
//       text: 'delete from user_accounts where email=$1 or phone=$2',
//       values: [accountInfo.email, accountInfo.phone],
//     })
//     // Register a new user and retrieve token
//     ;({
//       body: { token },
//     } = await registration(server, accountInfo))
//   })
//
//   const vendorsPath = '/v1/account/vendor'
//   const storesPath = '/v1/stores'
//
//   describe('Store management', () => {
//     before(async () => {
//       // Create a vendor account before each test
//       await testCreateVendor(server, token, vendorsPath)
//     })
//
//     after(async () => {
//       // Delete the vendor account after each test
//       await testDeleteVendor(server, token, vendorsPath)
//     })
//
//     let storeIds: string[] = []
//     it('should create a store for the vendor', async () => {
//       // Create stores using store information
//       for (const store of listOfStoresByVendor) {
//         const { store_id } = await testCreateStore(
//           server,
//           token,
//           storesPath,
//           null,
//           store
//         )
//         storeIds.push(store_id)
//       }
//     })
//
//     it('it should fetch all the stores with a loop', async () => {
//       for (const storeId of storeIds) {
//         await testGetStore(server, token, storesPath + '/' + storeId)
//       }
//     })
//
//     it('should update all the stores with a loop', async () => {
//       assert(storeIds.length === listOfUpdatedStoresByVendor.length)
//       // Bad bug never swap a & b in for (const [a, b] of ...) loop
//       let idx: number, storeId: string
//       for ([idx, storeId] of storeIds.entries()) {
//         await testUpdateStore(
//           server,
//           token,
//           storesPath + '/' + storeId,
//           null,
//           listOfUpdatedStoresByVendor[idx]
//         )
//       }
//     })
//
//     it('should delete all the stores with a loop', async () => {
//       for (const storeId of storeIds) {
//         await testDeleteStore(server, token, storesPath + '/' + storeId)
//       }
//     })
//
//     it('should fail to retrieve any store', async () => {
//       for (const storeId of storeIds) {
//         await testGetNonExistentStore(server, token, storesPath + '/' + storeId)
//       }
//     })
//   })
// }
