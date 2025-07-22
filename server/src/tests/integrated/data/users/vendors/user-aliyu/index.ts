// cspell:disable

import { ProfileRequestData } from '#src/types/profile/index.js'

export { listOfStores, updatedStores } from './stores.js'
export {
  products,
  productReplaced,
  productPartialUpdate,
  productMedia,
  updatedProductMedia,
} from './products/index.js'

const userInfo: ProfileRequestData = {
  first_name: 'Aliyu',
  last_name: 'Mustapha',
  email: 'aliyumustapha@gmail.com',
  phone: '+2348063249250',
  password: 'Aliyo99!',
  dob: new Date('1999-07-01'),
  country: 'Nigeria',
  is_customer: false,
  is_vendor: true,
}

const updatedProfileInfo = {
  dob: new Date('2000-06-08'),
} as ProfileRequestData

export { userInfo, updatedProfileInfo }
