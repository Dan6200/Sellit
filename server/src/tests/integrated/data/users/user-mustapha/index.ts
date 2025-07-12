// cspell: disable
import { UserRequestData } from '#src/types/users/index.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

const userInfo: UserRequestData = {
  first_name: 'Mustapha',
  last_name: 'Mohammed',
  email: 'mustymomo1019@outlook.com',
  phone: '2348063245973',
  password: '!23AishaBaggy9384',
  dob: new Date('2000-10-19'),
  country: 'Nigeria',
  is_customer: true,
  is_vendor: false,
}

const updatedUserInfo = {
  first_name: 'Mustapha',
  last_name: 'Mohammed',
  dob: new Date('2000-1-24'),
} as UserRequestData

export {
  userInfo,
  updatedUserInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
