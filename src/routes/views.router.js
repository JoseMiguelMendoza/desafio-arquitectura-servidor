import { Router } from 'express'
import { 
    auth, 
    auth2, 
    renderCartWithProductsPlusInfoUserController, 
    renderFailLoginViewController, 
    renderFailRegisterViewController, 
    renderHomeViewController,
    renderLoginViewController,
    renderProductsWithPaginateController,
    renderRealTimeProductsViewController,
    renderRegisterViewController,
    renderUserErrorViewController
} from '../controllers/views.controller.js'

const viewsRouter = Router()

viewsRouter.get('/', auth , renderHomeViewController)
viewsRouter.get('/realTimeProducts', auth , auth2 , renderRealTimeProductsViewController)
viewsRouter.get('/products', auth2, renderProductsWithPaginateController)
viewsRouter.get('/login', renderLoginViewController)
viewsRouter.get('/register', renderRegisterViewController)
viewsRouter.get('/userError', renderUserErrorViewController)
viewsRouter.get('/failRegister', renderFailRegisterViewController)
viewsRouter.get('/failLogin', renderFailLoginViewController)
viewsRouter.get('/carts/:cid', auth2, renderCartWithProductsPlusInfoUserController)

export default viewsRouter