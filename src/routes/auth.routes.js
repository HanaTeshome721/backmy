import { Router } from "express";
import {registerUser,login, logoutUser, verifyEmail, refreshAcessToken, forgotPasswordRequest,resetForgotPassword , getCurrentUser,changeCurrentPassword ,resendEmailVerification, updateCurrentUser} from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";


import {userRegisterValidator ,userLoginValidator, userChangeCurrentPasswordValidator,userForgotPasswordValidator, userResetForgotPasswordValidator}  from '../validators/index.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router =Router()
//unsecure route
router.route('/register').post(upload.single("avatar"), userRegisterValidator(), validate, registerUser)
router.route('/login').post(userLoginValidator(), validate,login)
router.route('/verify-email/:verificationToken').get(verifyEmail)

router.route('/refresh-token').post(refreshAcessToken)
router.route('/forgot-paswword').post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route('/forgot-password').post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword)

//secure routes
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/current-user').post(verifyJWT,getCurrentUser)
router.route('/me').get(verifyJWT,getCurrentUser)
router.route('/me').put(verifyJWT, updateCurrentUser)
router.route('/current-password').post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route('/change-password').post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT , resendEmailVerification)

export default router;