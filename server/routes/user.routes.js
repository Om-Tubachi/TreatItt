import Router from 'express'
import {
    loginUser,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle
} from '../controllers/index.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
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

// router.route('/auth/logout').post(verifyJWT, logoutUser);
router.route('/auth/me').get(verifyJWT, asyncHandler((async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
})))

export default router