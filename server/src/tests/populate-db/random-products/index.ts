import { faker } from '../faker.js'
import { ProductRequestData } from '../../../types/products.js'

const randomProduct = faker.commerce
export default function (this: ProductRequestData): ProductRequestData {
  return {
    title: randomProduct.productName(),
    description: [randomProduct.productDescription()],
    list_price: parseFloat(randomProduct.price()),
    net_price: this.list_price - (Math.random() * 1000 + 1),
    category_id: 1,
    subcategory_id: 1,
    quantity_available: Math.random() * 1000 + 1,
  }
}
