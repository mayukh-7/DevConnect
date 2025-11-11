import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError}from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
      const user =  await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async(req,res)=>{

    const {username, email, password} = req.body

    if([username, email, password].some((field)=>field?.trim()=== ""))
    {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser)
    {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        username: username,
        email,
        password,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //this line means we don't need this fields when giving response to the user
   )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
   )
})

const loginUser = asyncHandler( async (req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and refresh token-> access token is short lived refresh token is long lived
    //send cookie

    const {email, username, password} = req.body
    console.log(username)
    if(!username && !email)
    {
        throw new ApiError(400, "username or email is required")
    }

  const user =  await User.findOne({
        $or: [{username},{email}]
    })
    console.log(user)
    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Password does not exists")
    }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   // this make the cookie modifiable only by the server , the client side can only see the cookie but cannot modify it.
   const options = {
        httpOnly : true,
        secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken",refreshToken, options)
   .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "User logged In Successfully"
        )
   )
})

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken : 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken)
    {
        throw new ApiError(401, "unauthorised request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if (!user)
        {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshTokenefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
   const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect)
   {
     throw new ApiError(400, "Invalid old password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
   // 1. Get the data from the form
    const { username, bio } = req.body; 

    // 2. Find the user by their ID (from the JWT) and update them
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // Get the logged-in user's ID from the verifyJWT middleware
        {
            $set: {
                username: username,
                bio: bio
                // Add any other fields you are updating
            }
        },
        { new: true } // This option returns the *new, updated* document
    ).select("-password -refreshToken"); // IMPORTANT: Don't send the password back!

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    // 3. ✅ THE FIX ✅
    // Send the 'updatedUser' object, which is plain JSON-safe data.
    // This is your line 225.
    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
})

const updateUserProfilePic = asyncHandler(async(req,res)=>{
    const profilePicLocalPath = req.file?.path
    
    if(!profilePicLocalPath)
    {
        throw new ApiError(400, "Profile picture file is missing")
    }
    
    const profilePic = await uploadOnCloudinary(profilePicLocalPath)
    
    if(!profilePic.url)
    {
        throw new ApiError(400, "Error while uploading profile picture")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                ProfilePic: profilePic.url
            }
        },
        {new: true}
    ).select("-password")
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile picture updated successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
   const { username } = req.params;

    let user;

    if (username) {
        // 2. If a username exists (from /c/:username), find by username
        user = await User.findOne({ username }).select("-password -refreshToken");
    } else {
        // 3. If no username (from /me), find by the ID from the JWT
        if (!req.user?._id) {
             throw new ApiError(401, "Unauthorized: No token provided");
        }
        user = await User.findById(req.user._id).select("-password -refreshToken");
    }

    // 4. Handle if no user was found
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 5. Return the found user
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserProfilePic,
    getCurrentUser
}