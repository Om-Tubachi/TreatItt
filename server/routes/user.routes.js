import Router from 'express'
import {
    loginUser,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle
} from '../controllers/index.js'

const router = Router()

router
    .route('/auth/signup')
    .post(signupWithEmail)

router
    .route('/auth/login')
    .post(loginUser)

router
    .route('/auth/signup/google')
    .post(signupWithGoogle)

router
    .route('/auth/login/google')
    .post(loginWithGoogle)

export default router