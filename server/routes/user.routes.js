import Router from 'express'
import {
    forgotPassword,
    getUserById,
    loginUser,
    loginWithGoogle,
    resetPassword,
    searchUsers,
    signupWithEmail,
    signupWithGoogle
} from '../controllers/index.js'
import { prisma } from '../db/prisma.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
const router = Router()

router.route('/auth/signup').post(signupWithEmail)
router.route('/auth/login').post(loginUser)
router.route('/auth/signup/google').post(signupWithGoogle)
router.route('/auth/login/google').post(loginWithGoogle)
router.route('/auth/forgot-password').post(forgotPassword)
router.route('/auth/reset-password').post(resetPassword)

const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    res.json({ data: user });
});

router.route('/auth/me').get(verifyJWT, getMe)

// must sit above /:userId
router.route('/search').get(searchUsers)
router.route('/:userId').get(getUserById)

export default router