import { UserRequestData } from '../../../../../../types/users/index.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

// Make sure test data is correct especially dates
const userInfo: UserRequestData = {
  first_name: 'Aisha',
  last_name: 'Mohammed',
  email: 'aisha.mohammed@school.edu',
  phone: '234902539488',
  password: '236!a15HA04',
  dob: new Date('2004-6-23'),
  country: 'Nigeria',
}

const updatedUserInfo = {
  dob: new Date('2000-10-23'),
} as UserRequestData

export {
  userInfo,
  updatedUserInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
