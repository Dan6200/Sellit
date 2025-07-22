import {
  StoreDataRequestSchema,
  StoreDataResponseListSchema,
  StoreDataResponseSchema,
  StoreIDSchema,
} from '../app-schema/stores.js'

// Interface for common page styling properties
interface PageStyling {
  layout_template?: 'default' | 'minimal' | 'grid'
  font_family?: string // e.g., 'Arial', 'Roboto', 'Open Sans'
  primary_color?: string // e.g., '#FF0000'
  secondary_color?: string // e.g., '#00FF00'
}

interface Page extends PageStyling {
  pageType: 'storePage'
  pageTitle: string
  metaDescription: string
  canonicalUrl: string
  breadcrumbs: Array<{
    name: string
    url: string
  }>
  heroSection?: {
    title: string
    subtitle: string
    imageUrl: string
    altText: string
    callToAction: {
      text: string
      url: string
    }
  }
  categories: Array<{
    id: string
    name: string
    url: string
    thumbnailUrl: string
    description: string
  }>
  featuredProducts: Array<{
    id: string
    name: string
    sku: string
    imageUrl: string
    altText: string
    price: {
      amount: number
      currency: string
    }
    originalPrice?: {
      amount: number
      currency: string
    }
    rating: number
    numReviews: number
    productUrl: string
    shortDescription: string
    isInStock: boolean
  }>
  promotions: Array<
    | {
        id: string
        title: string
        description: string
        imageUrl: string
        altText: string
        targetUrl: string
      }
    | {
        id: string
        title: string
        description: string
        icon: string
      }
  >
  customerTestimonials: Array<{
    name: string
    location: string
    quote: string
    rating: number
  }>
  seoInfo: {
    keywords: string[]
    schemaMarkup: {
      '@context': string
      '@type': string
      name: string
      description: string
      url: string
    }
    // Open Graph for social media sharing
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogUrl?: string
    ogType?: string // e.g., 'website', 'article', 'product'
    // Twitter Cards for social media sharing
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
    twitterSite?: string
    twitterCreator?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
  }
}

export default interface StoreData {
  store_name: string
  vendor_id?: string
  custom_domain: string | null
  store_address: {
    address_line_1: string
    address_line_2: string
    city: string
    state: string
    zip_postal_code: string
    country: string
  }
  favicon: string
  default_page_styling?: PageStyling // Store-wide default styling for pages
  store_pages?: Page[]
  created_at?: Date
  updated_at?: Date
}

export type DBFriendlyStoreData = Omit<
  StoreData,
  'store_pages' | 'default_page_styling' | 'store_address'
> & {
  store_pages?: string
  default_page_styling?: string
  store_address?: string
}

// export const isValidStoreData = (
//   storeData: unknown,
// ): storeData is StoreData => {
//   return (
//     typeof storeData === 'object' &&
//     storeData != null &&
//     'store_name' in storeData
//     && 'store_pages' in storeData &&
//       storeData.store_pages != null
//   )
// }

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
