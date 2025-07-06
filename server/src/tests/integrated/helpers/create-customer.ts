import chai from 'chai'

export const createCustomerForTesting = (token: string) =>
  chai
    .request(process.env.SERVER!)
    .post('/v1/users/customers')
    .auth(token, { type: 'bearer' })
