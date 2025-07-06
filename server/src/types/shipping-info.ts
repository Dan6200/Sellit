import {
  ShippingInfoRequestSchema,
  ShippingInfoResponseListSchema,
  ShippingInfoResponseSchema,
  ShippingInfoSchemaID,
} from '../app-schema/shipping.js'

interface ShippingInfoId {
  shipping_info_id: number
}

export const isValidShippingInfoId = (
  data: unknown
): data is ShippingInfoId => {
  const { error } = ShippingInfoSchemaID.validate(data)
  error && console.error(error)
  return !error
}

export default interface ShippingInfo {
  shipping_info_id?: string
  recipient_first_name: string
  recipient_last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  delivery_contact: string
  delivery_instructions: string
  customer_id?: string
}

export const isValidShippingInfoRequest = (
  data: unknown
): data is ShippingInfo => {
  const { error } = ShippingInfoRequestSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidShippingInfoResponseList = (
  data: unknown
): data is ShippingInfo => {
  const { error } = ShippingInfoResponseListSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidShippingInfoResponse = (
  data: unknown
): data is ShippingInfo => {
  const { error } = ShippingInfoResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
