 
import { prisma } from "../db/prisma.js";
import supabaseAdmin from "../db/supabaseAdmin.js";
import { userService } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// TODO: signup controllers: linkedin
async function generateAccessAndRefreshTokens(user) {

    const accessToken = await userService.generateAccessToken(user)
    const refreshToken = await userService.generateRefreshToken(user)
    return { accessToken, refreshToken }
}


const signupWithEmail = asyncHandler(
    async (req, res) => {
        /*
        unpack user data from req.body
        send back if any data is missing
        send back if username/email already exists
        send back if selected industry doesnt exist

        generate access and refresh tokens 
        create the user in db
        send back sanitised user

        */

        const { username, fname, mname, lname, companyName, designation, email, contactNum, frpIndustryId, address, password } = req.body

        if ([username, fname, lname, password, email].some((field) => field?.trim() === "")) {
            throw new ApiError(409, "All fields are mandatory")
        }

        const existing = await prisma.users.findFirst({
            where: { OR: [{ username: username }, { email: email }] }
        })

        if (existing) {
            throw new ApiError(400, 'username or email already in use')
        }

        const invalidIndustry = await prisma.industries.findUnique({
            where: { id: frpIndustryId },
            select: { id: true } // Selecting only the ID is more efficient
        });

        if (!invalidIndustry) {
            throw new ApiError(404, "Invalid industry or the industry doesn't exist in the database")
        }

        const user = {
            username: username.toLowerCase(),
            first_name: fname,
            middle_name: mname || "",
            last_name: lname,
            company_name: companyName || "",
            designation: designation || "",
            email: email,
            contact_number: contactNum || "",
            frp_industry_id: frpIndustryId,
            address: address || "",
            password: password
        }

        const newUser = await userService.create(user, false)


        const userWithoutPasswordAndToken = await prisma.users.findUnique({
            where: { id: newUser?.id },
            omit: {
                password: true,
                refresh_token: true
            }
        })

        if (!userWithoutPasswordAndToken)
            throw new ApiError(500, "Something went wrong while registering on database")

        return res.status(201).json(
            new ApiResponse(200, userWithoutPasswordAndToken, "User registered succesfully")
        )
    }
)

const loginUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body

        if ([password, email].some((field) => field?.trim() === "")) {
            throw new ApiError(409, "All fields are mandatory")
        }

        const user = await prisma.users.findFirst({
            where: { email: email }
        })

        if (!user) {
            throw new ApiError(400, 'username or email not found, register before login')
        }

        const isPasswordCorrect = await userService.isPasswordCorrect(user?.id, password)
        if (!isPasswordCorrect)
            throw new ApiError(409, "Incorrect password, try again")

        const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user)

        await prisma.users.update({
            where: { id: user?.id },
            data: { refresh_token: refreshToken }
        })

        const loggedInUser = await prisma.users.findUnique({
            where: { id: user?.id },
            omit: {
                password: true,
                refresh_token: true
            }
        })

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    }
)

const signupWithGoogle = asyncHandler(
    async (req, res) => {
        const { username, fname, mname, lname, companyName, designation, email, contactNum, frpIndustryId, address, accessToken } = req.body

        if ([username, fname, lname, email].some((field) => field?.trim() === "")) {
            throw new ApiError(409, "All fields are mandatory")
        }

        const existing = await prisma.users.findFirst({
            where: { OR: [{ username: username }, { email: email }] }
        })

        if (existing) {
            throw new ApiError(400, 'username or email already in use')
        }

        const invalidIndustry = await prisma.industries.findUnique({
            where: { id: frpIndustryId },
            select: { id: true } // Selecting only the ID is more efficient
        });

        if (!invalidIndustry) {
            throw new ApiError(404, "Invalid industry or the industry doesn't exist in the database")
        }

        const { data: { user: supabaseUser } } = await supabaseAdmin.auth.getUser(accessToken)
        console.log(supabaseUser)

        if (!supabaseUser)
            throw new ApiError(400, 'failed to signup, try again')

        const googleId = supabaseUser?.user_metadata.sub

        const exists = await prisma.users.findUnique({
            where: { google_id: googleId }
        })

        if (exists)
            throw new ApiError(400, 'already signed up, log in please')

        const user = {
            username: username.toLowerCase(),
            first_name: fname,
            middle_name: mname || "",
            last_name: lname,
            company_name: companyName || "",
            designation: designation || "",
            email: email,
            contact_number: contactNum || "",
            frp_industry_id: frpIndustryId,
            address: address || "",
            google_id: googleId,
            is_verified: true,
        }

        const newUser = await userService.create(user, true)


        const userWithoutPasswordAndToken = await prisma.users.findUnique({
            where: { id: newUser?.id },
            omit: {
                password: true,
                refresh_token: true
            }
        })

        if (!userWithoutPasswordAndToken)
            throw new ApiError(500, "Something went wrong while registering on database")

        return res.status(201).json(
            new ApiResponse(200, userWithoutPasswordAndToken, "User registered succesfully")
        )


    }
)

const loginWithGoogle = asyncHandler(
    async (req, res) => {
        const { supabaseAccessToken } = req.body
        const { data: { user: supabaseUser } } = await supabaseAdmin.auth.getUser(supabaseAccessToken)
        console.log(supabaseUser)

        if (!supabaseUser)
            throw new ApiError(400, 'failed to signup, try again')

        const googleId = supabaseUser?.user_metadata.sub

        const existingUser = await prisma.users.findUnique({
            where: { google_id: googleId }
        })

        if (!existingUser)
            throw new ApiError(400, 'You are not signed up with google, sign up woth google then continue')

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser)

        await prisma.users.update({
            where: { id: existingUser?.id },
            data: { refresh_token: refreshToken }
        })

        const loggedInUser = await prisma.users.findUnique({
            where: { id: existingUser?.id },
            omit: {
                password: true,
                refresh_token: true
            }
        })

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully using Google"
                )
            )


    }
)






export {
    loginUser, loginWithGoogle, signupWithEmail,
    signupWithGoogle
};

