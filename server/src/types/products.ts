import {
  ProductIdSchema,
  ProductListResponseSchema,
  ProductRequestSchema,
  ProductResponseSchema,
} from '../app-schema/products.js'

export type ProductResponseData = {
  product_id: number
  vendor_id: string
  title: string
  category_id: number
  subcategory_id: number
  description: string
  list_price: number
  net_price: number
  quantity_available: number
}

export type ProductRequestData = {
  title: string
  category_id: number
  subcategory_id: number
  description: string[]
  list_price: number
  net_price: number
  quantity_available: number
}

export type ProductRequestPartial = Partial<ProductRequestData>

export type ProductMedia = {
  name: string
  path: string
  description: string
  is_display_image: boolean
  is_landing_image: boolean
  is_video: boolean
}

export function isValidProductRequestData(
  productData: unknown
): productData is ProductRequestData {
  const { error } = ProductRequestSchema.validate(productData)
  error && console.error(error)
  return !error
}

export function isValidProductResponseData(
  data: unknown
): data is ProductResponseData {
  const { error } = ProductResponseSchema.validate(data)
  error && console.error(error)
  return !error
}

export interface ProductID {
  product_id: number
}

export function isValidProductId(data: unknown): data is ProductID {
  const { error } = ProductIdSchema.validate(data)
  error && console.error(error)
  return !error
}

export function isValidProductListResponseData(
  data: unknown
): data is ProductResponseData[] {
  const { error } = ProductListResponseSchema.validate(data)
  error && console.error(error)
  return !error
}
