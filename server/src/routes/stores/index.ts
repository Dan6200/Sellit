import express from 'express'
import {
  createStore,
  getAllStores,
  getStore,
  updateStore,
  deleteStore,
} from '../../controllers/stores/index.js'

const router = express.Router()

router.route('/').post(createStore).get(getAllStores)

router.route('/:storeId').get(getStore).patch(updateStore).delete(deleteStore)

export default router
