import express from 'express'
import vendorRouter from './vendor/index.js'
import customerRouter from './customer/index.js'
import { getUser } from '../../controllers/user/index.js'
const router = express.Router()

router.route('/').get(getUser)

// users vendor account route
router.use('/vendors', vendorRouter)
// users customer account route
router.use('/customers', customerRouter)

export default router
