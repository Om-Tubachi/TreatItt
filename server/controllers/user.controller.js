import {prisma} from '../db/prisma.js'
import {asyncHandler} from "../utils/asyncHandler.js";

// TODO: signup controllers: email google linkedin

const signupWithEmail = asyncHandler(
    async (req, res) => {}
)


export {
    signupWithEmail,
}