import {
  StoreDataRequestSchema,
  StoreDataResponseListSchema,
  StoreDataResponseSchema,
  StoreIDSchema,
} from '../app-schema/stores.js'

export default interface StoreData {
  store_name: string
  vendor_id: string
  store_page?: {
    heading: string
    theme: 'light' | 'dark'
    pages: string[]
    hero: {
      media: { [idx: number]: string }
    }
    body: {
      product_listings: { product_ids: { [idx: number]: string } }
    }
  }
}

export const isValidStoreData = (
  storeData: unknown,
): storeData is StoreData => {
  return (
    typeof storeData === 'object' &&
    storeData != null &&
    'store_name' in storeData
    // && 'store_page' in storeData &&
    //   storeData.store_page != null
  )
}

interface StoreDataId {
  store_info_id: number
}

export const isValidStoreDataId = (data: unknown): data is StoreDataId => {
  const { error } = StoreIDSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidStoreDataRequest = (data: unknown): data is StoreData => {
  const { error } = StoreDataRequestSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidStoreDataResponseList = (
  data: unknown,
): data is StoreData => {
  const { error } = StoreDataResponseListSchema.validate(data)
  error && console.error(error)
  return !error
}

export const isValidStoreDataResponse = (data: unknown): data is StoreData => {
  const { error } = StoreDataResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
