import userModel from '../dao/models/user.model.js'

export const redirectionRegisterController = async(req, res) => {
    res.redirect('/login')
} 

export const redirectionLoginController = async (req, res) => {
    res.redirect('/products')
}

export const destroyingSessionController = (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.redirect('/userError')
        } else res.redirect('/login')
    })
}

export const redirectionGithubController = async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
}

export const userCompleteInfoController = async(req, res) => {
    if(!req.session.passport) return res.status(401).json({
        status: 'error',
        error: 'No session detected.'
    })
    let user_data = await userModel.findById(req.session.passport.user)
    res.status(200).json({ status: 'success', payload: {
        ID_USER: req.session.passport.user,
        USER_DATA: {
            name: user_data.name,
            surname: user_data.surname,
            email: user_data.email,
            age: user_data.age,
            ID_cart: user_data.cart
        }
    }})
}