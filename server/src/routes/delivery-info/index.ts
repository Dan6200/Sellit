import express from 'express'
import {
  createDeliveryInfo,
  getAllDeliveryInfo,
  getDeliveryInfo,
  updateDeliveryInfo,
  deleteDeliveryInfo,
} from '../../controllers/delivery-info/index.js'
const router = express.Router()

router.route('/').post(createDeliveryInfo).get(getAllDeliveryInfo)

router
  .route('/:deliveryInfoId')
  .get(getDeliveryInfo)
  .put(updateDeliveryInfo)
  .delete(deleteDeliveryInfo)

export default router
