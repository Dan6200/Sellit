import chai from 'chai'

export const createVendorForTesting = (token: string) =>
  chai
    .request(process.env.SERVER!)
    .post('/v1/users/vendors')
    .auth(token, { type: 'bearer' })
