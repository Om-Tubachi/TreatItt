import { prisma } from "../db/prisma.js";
import supabaseAdmin from "../db/supabaseAdmin.js";
import { userService } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function generateAccessAndRefreshTokens(user) {
    const accessToken = await userService.generateAccessToken(user)
    const refreshToken = await userService.generateRefreshToken(user)
    return { accessToken, refreshToken }
}

const signupWithEmail = asyncHandler(
    async (req, res) => {
        const { username, fname, mname, lname, companyName, designation, email, contactNum, frpIndustryId, address, password, latitude, longitude } = req.body

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
            select: { id: true }
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
            password: password,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
        }

        const newUser = await userService.create(user, false)

        const userWithoutPasswordAndToken = await prisma.users.findUnique({
            where: { id: newUser?.id },
            omit: { password: true, refresh_token: true }
        })

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser);

        await prisma.users.update({
            where: { id: newUser.id },
            data: { refresh_token: refreshToken }
        });

        const options = { httpOnly: true, secure: true };

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(201, { user: userWithoutPasswordAndToken, accessToken, refreshToken }, "User registered successfully"));
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
            omit: { password: true, refresh_token: true }
        })

        const options = { httpOnly: true, secure: true }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully")
            )
    }
)

const signupWithGoogle = asyncHandler(async (req, res) => {
    const { username, fname, mname, lname, companyName, designation, email, contactNum, frpIndustryId, address, accessToken, latitude, longitude } = req.body;

    if ([username, fname, lname, email].some((field) => field?.trim() === "")) {
        throw new ApiError(409, "All fields are mandatory");
    }

    const existing = await prisma.users.findFirst({
        where: { OR: [{ username }, { email }] }
    });
    if (existing) {
        throw new ApiError(400, 'username or email already in use');
    }

    const validIndustry = await prisma.industries.findUnique({
        where: { id: frpIndustryId },
        select: { id: true }
    });
    if (!validIndustry) {
        throw new ApiError(404, "Invalid industry");
    }

    const { data: { user: supabaseUser } } = await supabaseAdmin.auth.getUser(accessToken);

    if (!supabaseUser) throw new ApiError(400, 'failed to signup, try again');

    const googleId = supabaseUser.user_metadata.sub;

    const exists = await prisma.users.findUnique({ where: { google_id: googleId } });
    if (exists) {
        throw new ApiError(400, 'already signed up, log in please');
    }

    const userData = {
        username: username.toLowerCase(),
        first_name: fname,
        middle_name: mname || "",
        last_name: lname,
        company_name: companyName || "",
        designation: designation || "",
        email,
        contact_number: contactNum || "",
        frp_industry_id: frpIndustryId,
        address: address || "",
        google_id: googleId,
        is_verified: true,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
    };

    const newUser = await userService.create(userData, true);

    const userWithoutPasswordAndToken = await prisma.users.findUnique({
        where: { id: newUser.id },
        omit: { password: true, refresh_token: true }
    });

    const { accessToken: jwt, refreshToken } = await generateAccessAndRefreshTokens(newUser);

    await prisma.users.update({
        where: { id: newUser.id },
        data: { refresh_token: refreshToken }
    });

    const options = { httpOnly: true, secure: true };

    return res
        .status(201)
        .cookie("accessToken", jwt, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user: userWithoutPasswordAndToken, accessToken: jwt, refreshToken }, "User registered successfully"));
});

const loginWithGoogle = asyncHandler(async (req, res) => {
    const { supabaseAccessToken } = req.body;

    const { data: { user: supabaseUser } } = await supabaseAdmin.auth.getUser(supabaseAccessToken);

    if (!supabaseUser) throw new ApiError(400, 'failed to login, try again');

    const googleId = supabaseUser.user_metadata.sub;

    const existingUser = await prisma.users.findUnique({ where: { google_id: googleId } });
    if (!existingUser) {
        throw new ApiError(400, "You are not signed up with google, sign up first")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser);

    await prisma.users.update({
        where: { id: existingUser.id },
        data: { refresh_token: refreshToken }
    });

    const loggedInUser = await prisma.users.findUnique({
        where: { id: existingUser.id },
        omit: { password: true, refresh_token: true }
    });

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully using Google"));
});

// "raw" forgot-password — just presence check, no token/email
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const exists = await userService.checkEmailExists(email);
    if (!exists) throw new ApiError(404, "No account found with this email");

    res.status(200).json(new ApiResponse(200, { exists: true }, "Email found — proceed to reset password"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) throw new ApiError(400, "Email and new password are required");

    const updated = await userService.resetPasswordByEmail(email, newPassword);
    if (!updated) throw new ApiError(404, "No account found with this email");

    res.status(200).json(new ApiResponse(200, { success: true }, "Password reset successfully"));
});

const searchUsers = asyncHandler(async (req, res) => {
    const { q, limit } = req.query;
    const users = await userService.searchByUsername(q, limit ? parseInt(limit) : undefined);
    const withBadges = users.map(u => ({
        ...u,
        badges: [
            u.recyclers && 'Recycler',
            u.manufacturing_processes?.length && 'Manufacturer',
            u.frp_requirements?.length && 'Buyer',
        ].filter(Boolean)
    }));
    res.status(200).json(new ApiResponse(200, withBadges, "Users retrieved successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "User ID is required");

    const user = await userService.getUserById(userId);
    if (!user) throw new ApiError(404, "User does not exist");

    res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
});

export {
    forgotPassword, getUserById, loginUser, loginWithGoogle,
    resetPassword, searchUsers, signupWithEmail, signupWithGoogle
};
