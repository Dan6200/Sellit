// cspell: disable
import { ProfileRequestData } from '#src/types/profile/index.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

const userInfo: ProfileRequestData = {
  first_name: 'Ebuka',
  last_name: 'Eze',
  email: 'ebukachibueze5489@gmail.com',
  phone: '+2348032649250',
  password: 'EbukaDa1!',
  dob: new Date('1999-07-01'),
  country: 'Nigeria',
  is_customer: true,
  is_vendor: false,
}

const updatedProfileInfo: ProfileRequestData = {
  country: 'Ghana',
  first_name: 'John',
  dob: new Date('2003-06-08'),
} as ProfileRequestData

export {
  userInfo,
  updatedProfileInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
