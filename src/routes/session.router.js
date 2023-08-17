import { Router } from 'express'
import passport from 'passport';
import { 
    destroyingSessionController, 
    redirectionGithubController, 
    redirectionLoginController, 
    redirectionRegisterController, 
    userCompleteInfoController
} from '../controllers/session.controller.js';

const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failRegister'
}), redirectionRegisterController)

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/failLogin'
}), redirectionLoginController)

router.get('/logout', destroyingSessionController)

router.get('/github', passport.authenticate('github', { scope: ['user:email']}),
async(req, res) => {})

router.get('/api/session/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login'
}), redirectionGithubController)

router.get('/api/sessions/current', userCompleteInfoController)

export default router