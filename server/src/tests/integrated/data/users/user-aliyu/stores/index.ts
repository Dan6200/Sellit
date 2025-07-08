// cspell:disable
import StoreData from '@/types/store-data.js'

export const stores: StoreData[] = [
  {
    store_name: 'Inspire Denims',
    favicon: 'https://inspiredenims.com/favicon.ico',
    custom_domain: null,
    default_page_styling: {
      layout_template: 'default',
      font_family: 'Roboto',
      primary_color: '#336699',
      secondary_color: '#FF9900',
    },
    store_pages: [
      {
        pageType: 'storePage',
        pageTitle: 'Inspire Denims Home',
        metaDescription:
          'Shop the latest denim collection from Inspire Denims.',
        canonicalUrl: 'https://inspiredenims.com/',
        breadcrumbs: [{ name: 'Home', url: 'https://inspiredenims.com/' }],
        heroSection: {
          title: 'Discover Your Perfect Pair',
          subtitle: 'Premium denim for every style.',
          imageUrl: 'https://inspiredenims.com/hero.jpg',
          altText: 'Models wearing denim jeans',
          callToAction: {
            text: 'Shop Now',
            url: 'https://inspiredenims.com/shop',
          },
        },
        categories: [
          {
            id: 'jeans',
            name: 'Jeans',
            url: 'https://inspiredenims.com/jeans',
            thumbnailUrl: 'https://inspiredenims.com/jeans_thumb.jpg',
            description: 'Explore our wide range of denim jeans.',
          },
          {
            id: 'jackets',
            name: 'Jackets',
            url: 'https://inspiredenims.com/jackets',
            thumbnailUrl: 'https://inspiredenims.com/jackets_thumb.jpg',
            description: 'Stylish denim jackets for all seasons.',
          },
        ],
        featuredProducts: [
          {
            id: 'prod1',
            name: 'Slim Fit Jeans',
            sku: 'SFJ001',
            imageUrl: 'https://inspiredenims.com/slimfit.jpg',
            altText: 'Slim fit jeans',
            price: { amount: 59.99, currency: 'USD' },
            rating: 4.7,
            numReviews: 120,
            productUrl: 'https://inspiredenims.com/prod1',
            shortDescription: 'Comfortable and stylish slim fit jeans.',
            isInStock: true,
          },
          {
            id: 'prod2',
            name: 'Denim Jacket Classic',
            sku: 'DJC001',
            imageUrl: 'https://inspiredenims.com/denimjacket.jpg',
            altText: 'Classic denim jacket',
            price: { amount: 79.99, currency: 'USD' },
            originalPrice: { amount: 99.99, currency: 'USD' },
            rating: 4.9,
            numReviews: 85,
            productUrl: 'https://inspiredenims.com/prod2',
            shortDescription: 'A timeless classic denim jacket.',
            isInStock: true,
          },
        ],
        promotions: [
          {
            id: 'promo_sale',
            title: 'Summer Sale!',
            description: 'Up to 30% off all denim!',
            imageUrl: 'https://inspiredenims.com/sale_banner.jpg',
            altText: 'Summer Sale Banner',
            targetUrl: 'https://inspiredenims.com/sale',
          },
          {
            id: 'free_shipping',
            title: 'Free Shipping',
            description: 'On all orders over $75',
            icon: 'truck',
          },
        ],
        customerTestimonials: [
          {
            name: 'Jane D.',
            location: 'Los Angeles',
            quote: 'Absolutely love their jeans! Great quality and fit.',
            rating: 5,
          },
          {
            name: 'Mike R.',
            location: 'New York',
            quote: 'Fast shipping and excellent customer service.',
            rating: 4,
          },
        ],
        seoInfo: {
          keywords: ['denim', 'jeans', 'jackets', 'fashion', 'online store'],
          schemaMarkup: {
            '@context': 'http://schema.org',
            '@type': 'WebPage',
            name: 'Inspire Denims Home',
            description:
              'Shop the latest denim collection from Inspire Denims.',
            url: 'https://inspiredenims.com/',
          },
          ogTitle: 'Inspire Denims - Your Go-To for Quality Denim',
          ogDescription:
            'Discover the perfect pair of jeans and stylish denim jackets.',
          ogImage: 'https://inspiredenims.com/og_image.jpg',
          ogUrl: 'https://inspiredenims.com/',
          ogType: 'website',
          twitterCard: 'summary_large_image',
          twitterSite: '@InspireDenims',
          twitterCreator: '@InspireDenims',
          twitterTitle: 'Inspire Denims',
          twitterDescription: 'Shop the latest denim collection.',
          twitterImage: 'https://inspiredenims.com/twitter_image.jpg',
        },
      },
    ],
  },
  {
    store_name: 'Oraimo Electronics',
    favicon: 'https://oraimoelectronics.com/favicon.ico',
    custom_domain: 'https://oraimoelectronics.com',
    store_pages: [
      {
        pageType: 'storePage',
        pageTitle: 'Oraimo Electronics Home',
        metaDescription: 'Shop the latest electronics from Oraimo.',
        canonicalUrl: 'https://oraimoelectronics.com/',
        breadcrumbs: [{ name: 'Home', url: 'https://oraimoelectronics.com/' }],
        categories: [
          {
            id: 'headphones',
            name: 'Headphones',
            url: 'https://oraimoelectronics.com/headphones',
            thumbnailUrl: 'https://oraimoelectronics.com/headphones_thumb.jpg',
            description: 'High-quality headphones for every need.',
          },
        ],
        featuredProducts: [
          {
            id: 'prod3',
            name: 'Oraimo FreePods 3',
            sku: 'OFP300',
            imageUrl: 'https://oraimoelectronics.com/freepods3.jpg',
            altText: 'Oraimo FreePods 3',
            price: { amount: 45.0, currency: 'USD' },
            rating: 4.8,
            numReviews: 250,
            productUrl: 'https://oraimoelectronics.com/prod3',
            shortDescription: 'True wireless earbuds with deep bass.',
            isInStock: true,
          },
        ],
        promotions: [
          {
            id: 'new_arrival_promo',
            title: 'New Arrivals!',
            description: 'Check out our latest gadgets.',
            icon: 'new',
          },
        ],
        customerTestimonials: [
          {
            name: 'Chris P.',
            location: 'Texas',
            quote: 'Oraimo products never disappoint!',
            rating: 5,
          },
        ],
        seoInfo: {
          keywords: ['electronics', 'headphones', 'speakers', 'wearables'],
          schemaMarkup: {
            '@context': 'http://schema.org',
            '@type': 'WebPage',
            name: 'Oraimo Electronics Home',
            description: 'Shop the latest electronics from Oraimo.',
            url: 'https://oraimoelectronics.com/',
          },
        },
      },
    ],
  },
]

export const updatedStores: StoreData[] = [
  {
    store_name: 'Inspire Denims',
    favicon: 'https://inspiredenims.com/favicon.ico',
    custom_domain: 'https://inspiredenims.com',
    store_pages: [
      {
        pageType: 'storePage',
        pageTitle: 'Inspire Denims Home - Updated',
        metaDescription:
          'Shop the latest denim collection from Inspire Denims.',
        canonicalUrl: 'https://inspiredenims.com/',
        breadcrumbs: [{ name: 'Home', url: 'https://inspiredenims.com/' }],
        categories: [
          {
            id: 'jeans',
            name: 'Jeans',
            url: 'https://inspiredenims.com/jeans',
            thumbnailUrl: 'https://inspiredenims.com/jeans_thumb.jpg',
            description: 'Explore our wide range of denim jeans.',
          },
        ],
        featuredProducts: [
          {
            id: 'prod1',
            name: 'Slim Fit Jeans',
            sku: 'SFJ001',
            imageUrl: 'https://inspiredenims.com/slimfit.jpg',
            altText: 'Slim fit jeans',
            price: { amount: 59.99, currency: 'USD' },
            rating: 4.7,
            numReviews: 120,
            productUrl: 'https://inspiredenims.com/prod1',
            shortDescription: 'Comfortable and stylish slim fit jeans.',
            isInStock: true,
          },
        ],
        promotions: [
          {
            id: 'promo_sale',
            title: 'Summer Sale!',
            description: 'Up to 30% off all denim!',
            imageUrl: 'https://inspiredenims.com/sale_banner.jpg',
            altText: 'Summer Sale Banner',
            targetUrl: 'https://inspiredenims.com/sale',
          },
        ],
        customerTestimonials: [
          {
            name: 'Jane D.',
            location: 'Los Angeles',
            quote: 'Absolutely love their jeans! Great quality and fit.',
            rating: 5,
          },
        ],
        seoInfo: {
          keywords: ['denim', 'jeans', 'jackets', 'fashion', 'online store'],
          schemaMarkup: {
            '@context': 'http://schema.org',
            '@type': 'WebPage',
            name: 'Inspire Denims Home',
            description:
              'Shop the latest denim collection from Inspire Denims.',
            url: 'https://inspiredenims.com/',
          },
        },
      },
    ],
  },
  {
    store_name: 'Oraimo Electronics',
    favicon: 'https://oraimoelectronics.com/favicon.ico',
    custom_domain: 'https://oraimo.electronics.com',
    store_pages: [
      {
        pageType: 'storePage',
        pageTitle: 'Oraimo Electronics Home',
        metaDescription: 'Shop the latest electronics from Oraimo.',
        canonicalUrl: 'https://oraimoelectronics.com/',
        breadcrumbs: [{ name: 'Home', url: 'https://oraimoelectronics.com/' }],
        categories: [
          {
            id: 'headphones',
            name: 'Headphones',
            url: 'https://oraimoelectronics.com/headphones',
            thumbnailUrl: 'https://oraimoelectronics.com/headphones_thumb.jpg',
            description: 'High-quality headphones for every need.',
          },
        ],
        featuredProducts: [
          {
            id: 'prod3',
            name: 'Oraimo FreePods 3',
            sku: 'OFP300',
            imageUrl: 'https://oraimoelectronics.com/freepods3.jpg',
            altText: 'Oraimo FreePods 3',
            price: { amount: 45.0, currency: 'USD' },
            rating: 4.8,
            numReviews: 250,
            productUrl: 'https://oraimoelectronics.com/prod3',
            shortDescription: 'True wireless earbuds with deep bass.',
            isInStock: true,
          },
        ],
        promotions: [
          {
            id: 'new_arrival_promo',
            title: 'New Arrivals!',
            description: 'Check out our latest gadgets.',
            icon: 'new',
          },
        ],
        customerTestimonials: [
          {
            name: 'Chris P.',
            location: 'Texas',
            quote: 'Oraimo products never disappoint!',
            rating: 5,
          },
        ],
        seoInfo: {
          keywords: ['electronics', 'headphones', 'speakers', 'wearables'],
          schemaMarkup: {
            '@context': 'http://schema.org',
            '@type': 'WebPage',
            name: 'Oraimo Electronics Home',
            description: 'Shop the latest electronics from Oraimo.',
            url: 'https://oraimoelectronics.com/',
          },
        },
      },
    ],
  },
]
