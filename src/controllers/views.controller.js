import userModel from "../dao/models/user.model.js"
import cartModel from "../dao/models/cart.model.js"
import ProductManager from "../dao/mongo/productManager.js"

const productManager = new ProductManager()

export const auth = async(req, res, next) => {
    if(!req.session?.passport){
        return res.render('userError', {
            title: 'Error',
            statusCode: 403,
            error: 'There is no user logged-in.',
            user: false
        })
    }
    const user = await userModel.findById(req.session.passport.user)
    if(user.email === 'adminCoder@coder.com' && user.role === "Administrador/a") {
        return next()
    }
    return res.render('userError', {
        title: 'Not Admin',
        statusCode: 403,
        error: 'Only avaiable for Administrators.',
        user: req.session.passport.user ? true : false
    })
}

export const auth2 = (req, res, next) => {
    if(req.session?.passport.user) {
        return next()
    }
    return res.render('userError', {
        title: 'Error',
        statusCode: 403,
        error: 'You must create a user, sign in or wait a few seconds before logging in again.',
        user: false
    })
}

export const renderHomeViewController = async(req, res) => {
    let result = await productManager.getProducts()
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: result
    })
}

export const renderRealTimeProductsViewController = async(req, res) => {
    const user = await userModel.findById(req.session.passport.user)
    res.render('realTimeProducts', {
        title: "Handlebars | Websocket",
        products: await productManager.getProducts(),
        name: user.name,
        role: user.role,
        checkingRole: user.role === 'Administrador/a' ? true : false
    })
}

export const renderProductsWithPaginateController = async(req, res) => {
    const result = await productManager.getProductsWithFilters(req)
    const user = await userModel.findById(req.session.passport.user)
    res.render('products', {
        title: 'Paginate | Handlebars',
        products: result.response.payload,
        paginateInfo : {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink
        },
        name: user.name,
        role: user.role,
        checkingRole: user.role === 'Administrador/a' ? true : false,
        cid: user.cart
    })
}

export const renderLoginViewController = (req, res) => {
    res.render('login', {
        title: 'Login - Iniciar sesión'
    })
}

export const renderRegisterViewController = (req, res) => {
    res.render('register', {
        title: 'Registrarse'
    })
}

export const renderUserErrorViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'An error has ocurred. Do not enter this link.',
        user: req.session.passport.user ? true : false
    })
}

export const renderFailRegisterViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'Email already exists or you did not complete all the fields or register failed.',
        statusCode: 401,
        user: false
    })
}

export const renderFailLoginViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'User not found or incorrect password, please check carefully again.',
        statusCode: 401,
        user: false
    })
}

export const renderCartWithProductsPlusInfoUserController = async(req, res) =>{
    try{
        let cid = req.params.cid
        let cartById = await cartModel.findById(cid).populate('products.product').lean()
        const user = await userModel.findById(req.session.passport.user)
        if(cartById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        res.render('cart', {
            title: 'Carrito',
            cid: user.cart,
            products: cartById.products,
            name: user.name,
            role: user.role,
            checkingRole: user.role === 'Administrador/a' ? true : false
        })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}