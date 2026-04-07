import Router from 'express'
import {
    loginUser,
    signupWithEmail
} from '../controllers/user.controller.js'

const router = Router()

router
    .route('/auth/signup')
    .post(signupWithEmail)

router
    .route('/auth/login')
    .post(loginUser)

export default router