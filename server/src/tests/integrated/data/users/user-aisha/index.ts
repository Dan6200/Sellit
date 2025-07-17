import { ProfileRequestData } from '#src/types/users/index.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

// Make sure test data is correct especially dates
const userInfo: ProfileRequestData = {
  first_name: 'Aisha',
  last_name: 'Mohammed',
  email: 'aisha.mohammed@school.edu',
  phone: '234902539488',
  password: '236!a15HA04',
  dob: new Date('2004-6-23'),
  country: 'Nigeria',
  is_customer: true,
  is_vendor: false,
}

const updatedProfileInfo = {
  dob: new Date('2000-10-23'),
} as ProfileRequestData

export {
  userInfo,
  updatedProfileInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
