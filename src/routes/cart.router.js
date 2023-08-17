import { Router } from 'express'
import { 
    addProductInCartWithCidAndPidController, createCartController, deleteAllProductsFromCartController, deleteProductFromCartController, getCartsController, getCartsWithIdController, updateCartWithIdController, updateQuantityProductInCartController, 
} from '../controllers/cart.controller.js'

const CartRouter = Router()

CartRouter.get('/', getCartsController)
CartRouter.get('/:cid', getCartsWithIdController)
CartRouter.post('/', createCartController)
CartRouter.post('/:cid/product/:pid', addProductInCartWithCidAndPidController)
CartRouter.put('/:cid', updateCartWithIdController)
CartRouter.put('/:cid/products/:pid', updateQuantityProductInCartController)
CartRouter.delete('/:cid', deleteAllProductsFromCartController)
CartRouter.delete('/:cid/products/:pid', deleteProductFromCartController)

export default CartRouter