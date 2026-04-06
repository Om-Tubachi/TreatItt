import Router from 'express'
import {
    signupWithEmail
} from '../controllers/index.js'

const router = Router()

router
    .route('/auth/signup')
    .post(signupWithEmail)

export default router