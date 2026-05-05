import Router from 'express'
import {
    loginUser,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle
} from '../controllers/index.js'
import { prisma } from '../db/prisma.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
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

const getMe = asyncHandler(async (req, res) => {
    // 1. Check if user exists on the request (set by your auth middleware)
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    // 2. Fetch user only if req.user exists
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    res.json({ data: user });
});

router.route('/auth/me').get(verifyJWT, getMe)


export default router