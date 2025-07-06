// cspell:disable
import StoreData from '@/types/store-data.js'

export const stores: StoreData[] = [
  {
    store_name: 'Inspire Denims',
    store_page: {
      heading: 'Inspire Denims',
      theme: 'dark',
      pages: ['Home', 'New Arrivals', 'Promos', 'Contact'],
      hero: {
        media: [
          'https://promo_video.mov',
          'https://inspire_denim_jacket.jpg',
          'https://inspire_denim1.jpg',
          'https://inspire_denim2.jpg',
        ],
      },
      body: {
        product_listings: { product_ids: ['1', '2', '3'] },
      },
    },
  },
  {
    store_name: 'Oraimo Electronics',
    store_page: {
      heading: 'Oriamo Electronics',
      theme: 'dark',
      pages: ['Home', 'New Arrivals', 'Promos', 'Contact'],
      hero: {
        media: [
          'https://oriamo_headphones.jpg',
          'https://oriamo_speaker.jpg',
          'https://oriamo_fitband.jpg',
        ],
      },
      body: {
        product_listings: { product_ids: ['1', '2', '3'] },
      },
    },
  },
]
export const updatedStores: StoreData[] = [
  {
    store_name: 'Inspire Denims',
    store_page: {
      heading: 'Inspire Denims',
      theme: 'dark',
      pages: ['Home', 'New Arrivals', 'Promos', 'Contact'],
      hero: {
        media: [
          'https://inspire_denim_jacket.jpg',
          'https://inspire_denim1.jpg',
          'https://inspire_denim2.jpg',
        ],
      },
      body: {
        product_listings: {
          product_ids: ['3', '4', '5'],
        },
      },
    },
  },
  {
    store_name: 'Oriamo Electronics',
    store_page: {
      heading: 'Oriamo Electronics',
      theme: 'dark',
      pages: ['Home', 'New Arrivals', 'Promos', 'Contact'],
      hero: {
        media: [
          'https://oriamo_headphones.jpg',
          'https://oriamo_speaker.jpg',
          'https://oriamo_fitband.jpg',
        ],
      },
      body: {
        product_listings: { product_ids: ['1', '2', '3'] },
      },
    },
  },
]
