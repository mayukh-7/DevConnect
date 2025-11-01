import {Router} from "express";
import { changeCurrentPassword,  getCurrentUser,  loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { updateUserProfilePic } from "../controllers/user.controller.js";
const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-profile").patch(verifyJWT, updateAccountDetails)
router.route("/profilepic").patch(verifyJWT, upload.single("ProfilePic"), updateUserProfilePic)
// router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

// In this route we have to give the same name that we have taken while destructuring because we are taking the data from req.params
// router.route("/c/:username").get(verifyJWT,getCurrentUser)
router.route("/me").get(verifyJWT,getCurrentUser)

export default router