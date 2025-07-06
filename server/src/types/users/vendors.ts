import { VendorSchemaID } from '../../app-schema/vendors.js'

interface VendorId {
  vendor_id: string
}

export const isValidVendorId = (data: unknown): data is VendorId => {
  const { error } = VendorSchemaID.validate(data)
  error && console.error(error)
  return !error
}
