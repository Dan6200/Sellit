import express from 'express'
import { getProfile } from '../../controllers/profile/index.js'
const router = express.Router()

router.route('/').get(getProfile)

export default router
