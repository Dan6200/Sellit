import { ProductMedia } from '../../../types/products.js'
import { faker } from '../faker.js'

const randomMedia = faker.image

export default function (): ProductMedia {
  return {
    name: faker.string.alphanumeric(),
    path: randomMedia.url(),
    is_display_image: true,
    is_landing_image: true,
    is_video: false,
    description: faker.lorem.sentence(),
  }
}
