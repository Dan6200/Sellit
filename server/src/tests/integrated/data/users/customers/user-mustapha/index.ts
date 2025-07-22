// cspell: disable
import { ProfileRequestData } from '#src/types/profile/index.js'
import {
  listOfDeliveryInfo,
  listOfUpdatedDeliveryInfo,
} from './delivery-info.js'

const userInfo: ProfileRequestData = {
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

const updatedProfileInfo = {
  first_name: 'Mustapha',
  last_name: 'Mohammed',
  dob: new Date('2000-1-24'),
} as ProfileRequestData

export {
  userInfo,
  updatedProfileInfo,
  listOfDeliveryInfo,
  listOfUpdatedDeliveryInfo,
}
