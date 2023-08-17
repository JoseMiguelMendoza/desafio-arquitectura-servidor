import passport from "passport";
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import CartManager from "../dao/mongo/cartManager.js";

const cartManager = new CartManager()

const LocalStrategy = local.Strategy

const initializePassport = () => {


    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { name, surname, email, age } = req.body
        try{
            const user = await userModel.findOne({ email: username })
            if (user){
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = {
                name, surname, email, age, password: createHash(password)
            }
            if(newUser.email === process.env.ADMIN_EMAIL){
                newUser.role = 'Administrador/a'
            } else{
                newUser.role = 'Usuario/a'
            }

            newUser.cart = await cartManager.addCarts()

            const result = await userModel.create(newUser)
            return done(null, result)
            
        } catch(err){
            return done('Error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username })
            if(!user){
                return done(null, false)
            }
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        }catch (err) {
            return done('Error al logearse')
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne( { email: profile._json.email })
            if(user) return done(null, user)

            const newUser = await userModel.create({
                name: profile._json.name,
                surname: " ",
                email: profile._json.email,
                age: " ",
                cart: await cartManager.addCarts(),
                password: " ",
                role: 'Usuario/a' 
            })
            return done(null, newUser)
        }catch (err) {
            return done(`Error to login with GitHub: ${err}`)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport