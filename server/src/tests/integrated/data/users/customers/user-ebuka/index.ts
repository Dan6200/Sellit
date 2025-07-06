// cspell: disable
import { UserRequestData } from '../../../../../../types/users/index.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

const userInfo: UserRequestData = {
  first_name: 'Ebuka',
  last_name: 'Eze',
  email: 'ebukachibueze5489@gmail.com',
  phone: '+2348032649250',
  password: 'EbukaDa1!',
  dob: new Date('1999-07-01'),
  country: 'Nigeria',
}

const updatedUserInfo: UserRequestData = {
  country: 'Ghana',
  first_name: 'John',
  dob: new Date('2003-06-08'),
} as UserRequestData

export {
  userInfo,
  updatedUserInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
