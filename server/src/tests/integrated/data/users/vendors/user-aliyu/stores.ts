import StoreData from '#src/types/store-data.js'

export const listOfStores: StoreData[] = [
  {
    store_name: "Aliyu's Gadgets",
    custom_domain: null,
    favicon: 'https://some-url.com/favicon.ico',
    store_address: {
      address_line_1: '123, Herbert Macaulay Way',
      address_line_2: 'Yaba',
      city: 'Lagos',
      state: 'Lagos',
      zip_postal_code: '101212',
      country: 'Nigeria',
    },
  },
]

export const updatedStores: StoreData[] = [
  {
    store_name: "Aliyu's Updated Gadgets",
    custom_domain: null,
    favicon: 'https://some-other-url.com/favicon.ico',
    store_address: {
      address_line_1: '456, New Street',
      address_line_2: 'Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      zip_postal_code: '100001',
      country: 'Nigeria',
    },
  },
]
