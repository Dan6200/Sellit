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
  data: unknown,
): data is ShippingInfoId => {
  const { error } = ShippingInfoSchemaID.validate(data)
  error && console.error(error)
  return !error
}

export default interface ShippingInfo {
  shipping_info_id?: number
  recipient_full_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_postal_code: string
  country: string
  phone_number: string
  delivery_instructions: string
  customer_id?: string
  created_at?: Date
  updated_at?: Date
}

export const isValidShippingInfoRequest = (
  data: unknown,
): data is ShippingInfo => {
  const { error } = ShippingInfoRequestSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidShippingInfoResponseList = (
  data: unknown,
): data is ShippingInfo => {
  const { error } = ShippingInfoResponseListSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidShippingInfoResponse = (
  data: unknown,
): data is ShippingInfo => {
  const { error } = ShippingInfoResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
