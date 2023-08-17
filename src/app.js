import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import ProductManager from './dao/mongo/productManager.js'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import session from 'express-session'
import config from './config/config.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'

import messageModel from './dao/models/message.model.js'
import cartModel from './dao/models/cart.model.js'

import productRouter from './routes/product.router.js'
import viewsRouter from './routes/views.router.js'
import cartRouter from './routes/cart.router.js'
import chatRouter from './routes/chat.router.js'
import sessionRouter from './routes/session.router.js'

const app = express()
export const PORT = config.apiserver.port

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.uri,
        collectionName: config.mongo.collectionName,
        mongoOptions: {
            useNewUrlPArser: true,
            useUnifiedTopology: true
        }
    }),
    secret: config.mongo.secret,
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const productManager = new ProductManager()
const httpServer = app.listen(PORT, () =>  console.log(`Server Express Puerto ${PORT}`))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.static('./src/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)
app.use('/chat', chatRouter)
app.use('/', sessionRouter)

mongoose.set('strictQuery', false)
try{
    await mongoose.connect(config.mongo.uri)
    console.log('DB connected!')
} catch(err){
    console.log(err.message)
}

io.on("connection", socket => {
    console.log('A new client has connected to the Server')
    socket.on('productList', async(data) => {
        await productManager.addProducts(data)
            .then(data => {
                io.emit('updatedProducts', data)
            })
            .catch(err => {
                console.error('Error:', err);
            })
    });

    messageModel.find().lean().exec()
        .then(messages => {
            socket.emit('logs', messages);
        })
        .catch(error => {
            console.error('Error al obtener los mensajes:', error);
        });

    socket.on('message', async (data) => {
        await messageModel.create(data)
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
            });

        messageModel.find().lean().exec()
            .then(messages => {
                io.emit('logs', messages);
            })
            .catch(error => {
                console.error('Error al obtener los mensajes:', error);
            });
    });

    socket.on('eliminarProductoDelCarrito', async({cartId, productId}) => {
        try {
            let updatedCart = await cartModel.findById(cartId).populate('products.product').lean()
            socket.emit('productoEliminado', updatedCart);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    })
});