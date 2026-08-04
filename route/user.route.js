import { Router } from 'express';
import { registerUserController, verifyEmailController, loginUserController, logoutUserController, 
userAvatarController,  removeImageFromCloudinary, updateUserDetails, forgotPasswordController,
verifyForgotPasswordOtp, resetPassword, refreshToken, userDetails} from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';


const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/verifyEmail', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.get('/logout', auth, logoutUserController);
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-Token', refreshToken);
userRouter.get('/user-details',auth, userDetails);

export default userRouter;