//cspell:ignore birthdate
import { UserRequestData } from '../../types/users/index.js'
import { faker } from './faker.js'

export default function (): UserRequestData & { password: string } {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    dob: faker.date.birthdate({ min: 12 }),
    country: 'Nigeria',
    is_vendor: Boolean(Math.round(Math.random())),
    is_customer: Boolean(Math.round(Math.random())),
  }
}
