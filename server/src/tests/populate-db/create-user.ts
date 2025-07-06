import axios from 'axios'
import { UserRequestData } from '../../types/users/index.js'

export default async function (server: string, accountInfo: UserRequestData) {
  try {
    const response = await axios.post(`${server}/v1/user`, accountInfo)
    return response.data
  } catch (error) {
    throw error
  }
}
