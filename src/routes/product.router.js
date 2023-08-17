import { Router } from 'express'
import { 
    addProduct,
    deleteProductWithId,
    getProductWithId,
    getProducts, 
    updateProductWithId
} from '../controllers/product.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductWithId)
router.post('/', addProduct)
router.put('/:id', updateProductWithId)
router.delete('/:id', deleteProductWithId)

export default router