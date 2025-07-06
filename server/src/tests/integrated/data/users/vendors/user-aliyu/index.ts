// cspell:disable

import { UserRequestData } from '../../../../../../types/users/index.js'

export { stores, updatedStores } from './stores/index.js'
export {
  products,
  productReplaced,
  productPartialUpdate,
  productMedia,
  updatedProductMedia,
} from './products/index.js'

const userInfo: UserRequestData = {
  first_name: 'Aliyu',
  last_name: 'Mustapha',
  email: 'aliyumustapha@gmail.com',
  phone: '+2348063249250',
  password: 'Aliyo99!',
  dob: new Date('1999-07-01'),
  country: 'Nigeria',
}

const updatedUserInfo = {
  dob: new Date('2000-06-08'),
} as UserRequestData

export { userInfo, updatedUserInfo }
