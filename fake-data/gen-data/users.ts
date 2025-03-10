// cspell:ignore fastcsv birthdate
import { createWriteStream } from 'fs'
import { faker } from '@faker-js/faker'
import * as fastcsv from 'fast-csv'

let users = [
  ['uid', 'first_name', 'last_name', 'email', 'phone', 'dob', 'country'],
]

let { person, internet, phone, string, date, location } = faker

for (let i = 1; i <= 500; i++) {
  users.push([
    string.nanoid(),
    person.firstName(),
    person.lastName(),
    internet.email(),
    phone.number(),
    date.birthdate().toISOString().split('T')[0],
    location.country(),
  ] as any[])
}

let outFile = 'users.csv'
let wStream = createWriteStream(outFile)

fastcsv
  .write(users as any[], { headers: true })
  .pipe(wStream)
  .on('finish', () => console.log('data written to ' + outFile))
