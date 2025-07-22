import {
  DeliveryInfoRequestSchema,
  DeliveryInfoResponseListSchema,
  DeliveryInfoResponseSchema,
  DeliveryInfoSchemaID,
} from '../app-schema/delivery-info.js'

interface DeliveryInfoId {
  delivery_info_id: number
}

export const isValidDeliveryInfoId = (
  data: unknown,
): data is DeliveryInfoId => {
  const { error } = DeliveryInfoSchemaID.validate(data)
  error && console.error(error)
  return !error
}

export default interface DeliveryInfo {
  delivery_info_id?: number
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

export const isValidDeliveryInfoRequest = (
  data: unknown,
): data is DeliveryInfo => {
  const { error } = DeliveryInfoRequestSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidDeliveryInfoResponseList = (
  data: unknown,
): data is DeliveryInfo => {
  const { error } = DeliveryInfoResponseListSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidDeliveryInfoResponse = (
  data: unknown,
): data is DeliveryInfo => {
  const { error } = DeliveryInfoResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
