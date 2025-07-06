export interface StoreData {
  store_name: string
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
