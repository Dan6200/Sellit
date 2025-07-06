import { CustomerSchemaID } from '../../app-schema/customers.js'

interface CustomerId {
  customer_id: string
}

export const isValidCustomerId = (data: unknown): data is CustomerId => {
  const { error } = CustomerSchemaID.validate(data)
  error && console.error(error)
  return !error
}
