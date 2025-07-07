import joi from 'joi'

const PageStylingSchema = joi.object({
  layout_template: joi.string().valid('default', 'minimal', 'grid').optional(),
  font_family: joi.string().optional(),
  primary_color: joi.string().optional(),
  secondary_color: joi.string().optional(),
})

const PageSchema = joi
  .object({
    pageType: joi.string().valid('storePage').required(),
    pageTitle: joi.string().required(),
    metaDescription: joi.string().required(),
    canonicalUrl: joi.string().uri().required(),
    breadcrumbs: joi.array().items(
      joi.object({
        name: joi.string().required(),
        url: joi.string().uri().required(),
      }),
    ),
    heroSection: joi
      .object({
        title: joi.string().required(),
        subtitle: joi.string().required(),
        imageUrl: joi.string().uri().required(),
        altText: joi.string().required(),
        callToAction: joi.object({
          text: joi.string().required(),
          url: joi.string().uri().required(),
        }),
      })
      .optional(),
    categories: joi.array().items(
      joi.object({
        id: joi.string().required(),
        name: joi.string().required(),
        url: joi.string().uri().required(),
        thumbnailUrl: joi.string().uri().required(),
        description: joi.string().required(),
      }),
    ),
    featuredProducts: joi.array().items(
      joi.object({
        id: joi.string().required(),
        name: joi.string().required(),
        sku: joi.string().required(),
        imageUrl: joi.string().uri().required(),
        altText: joi.string().required(),
        price: joi
          .object({
            amount: joi.number().required(),
            currency: joi.string().required(),
          })
          .required(),
        originalPrice: joi
          .object({
            amount: joi.number().required(),
            currency: joi.string().required(),
          })
          .optional(),
        rating: joi.number().min(0).max(5).required(),
        numReviews: joi.number().min(0).required(),
        productUrl: joi.string().uri().required(),
        shortDescription: joi.string().required(),
        isInStock: joi.boolean().required(),
      }),
    ),
    promotions: joi.array().items(
      joi.alternatives().try(
        joi.object({
          id: joi.string().required(),
          title: joi.string().required(),
          description: joi.string().required(),
          imageUrl: joi.string().uri().required(),
          altText: joi.string().required(),
          targetUrl: joi.string().uri().required(),
        }),
        joi.object({
          id: joi.string().required(),
          title: joi.string().required(),
          description: joi.string().required(),
          icon: joi.string().required(),
        }),
      ),
    ),
    customerTestimonials: joi.array().items(
      joi.object({
        name: joi.string().required(),
        location: joi.string().required(),
        quote: joi.string().required(),
        rating: joi.number().min(0).max(5).required(),
      }),
    ),
    seoInfo: joi
      .object({
        keywords: joi.array().items(joi.string()).required(),
        schemaMarkup: joi
          .object({
            '@context': joi.string().required(),
            '@type': joi.string().required(),
            name: joi.string().required(),
            description: joi.string().required(),
            url: joi.string().uri().required(),
          })
          .required(),
        ogTitle: joi.string().optional(),
        ogDescription: joi.string().optional(),
        ogImage: joi.string().uri().optional(),
        ogUrl: joi.string().uri().optional(),
        ogType: joi.string().optional(),
        twitterCard: joi
          .string()
          .valid('summary', 'summary_large_image', 'app', 'player')
          .optional(),
        twitterSite: joi.string().optional(),
        twitterCreator: joi.string().optional(),
        twitterTitle: joi.string().optional(),
        twitterDescription: joi.string().optional(),
        twitterImage: joi.string().uri().optional(),
      })
      .required(),
  })
  .concat(PageStylingSchema) // Concatenate PageStylingSchema

export const StoreDataRequestSchema = joi
  .object({
    store_name: joi.string().min(3).max(50).required(),
    favicon: joi.string().uri().required(),
    custom_domain: joi.string().uri().allow(null).required(),
    default_page_styling: PageStylingSchema.optional(),
    store_pages: joi.array().items(PageSchema).optional(),
  })
  .required()

export const StoreDataRequestPartialSchema = joi.object({
  store_name: joi.string().min(3).max(50).optional(),
  favicon: joi.string().uri().optional(),
  custom_domain: joi.string().uri().allow(null).optional(),
  default_page_styling: PageStylingSchema.optional(),
  store_pages: joi.array().items(PageSchema).optional(),
})

export const StoreIDSchema = joi.object({
  store_id: joi.number().required(),
})

export const StoreDataResponseListSchema = joi
  .array()
  .items(
    joi
      .object({
        store_id: joi.number().required(),
        store_name: joi.string().min(3).max(50).required(),
        custom_domain: joi.string().uri().allow(null).required(),
        vendor_id: joi.string().guid({ version: 'uuidv4' }).required(),
        favicon: joi.string().uri().required(),
        default_page_styling: PageStylingSchema.optional(),
        store_pages: joi.array().items(PageSchema).optional(),
        date_created: joi
          .alternatives()
          .try(joi.string().required(), joi.date().required()),
      })
      .required(),
  )
  .required()

export const StoreDataResponseSchema = joi
  .object({
    store_id: joi.number().required(),
    store_name: joi.string().min(3).max(50).required(),
    custom_domain: joi.string().uri().allow(null).required(),
    vendor_id: joi.string().guid({ version: 'uuidv4' }).required(),
    favicon: joi.string().uri().required(),
    default_page_styling: PageStylingSchema.optional(),
    store_pages: joi.array().items(PageSchema).optional(),
    date_created: joi
      .alternatives()
      .try(joi.string().required(), joi.date().required()),
  })
  .required()
