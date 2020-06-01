import { UserController } from './../controllers/UserController';
import { GlobalMiddleware } from '../middleware/CheckError' ;
import { UserValidators } from '../validators/UserValidators';

import { Router } from "express";
import { Utils } from '../utils/Utils';



class UserRouter {
    public router : Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes(){
        // 3 Route to resend verification token to email address
        this.router.get('/send/verification/email',GlobalMiddleware.authenticate,UserValidators.resendVerificationEmail(),GlobalMiddleware.checkError,UserController.resendVerficationEmail);
        //  4 Route to login
        this.router.get('/login',UserValidators.login(),GlobalMiddleware.checkError,UserController.login);
        // 6 Route to reset password through EMAIL if the user forgets his password
        this.router.get('/reset/password',UserValidators.sendResetPasswordEmail(),GlobalMiddleware.checkError,UserController.sendResetPasswordEmail);
        //  7 Route to confirm the reset password token that has been generated
        this.router.get('/verify/resetPasswordToken',UserValidators.verifyResetPasswordToken(),GlobalMiddleware.checkError,UserController.verifyResetPasswordToken)
    }

    postRoutes(){
        // 1 signup request (registering a user)
        this.router.post('/signup',UserValidators.signUp(),GlobalMiddleware.checkError,UserController.signUp)
    }

    patchRoutes(){
        // 2 Verify the account after the user has signed up
        this.router.patch('/verify',GlobalMiddleware.authenticate,UserValidators.verifyUser(),GlobalMiddleware.checkError,UserController.verify);
        // 5 Funciton to update password
        this.router.patch('/update/password',GlobalMiddleware.authenticate,UserValidators.updatePassword(),GlobalMiddleware.checkError,UserController.updatePassword);
        // 8 Route to change the password after token validation
        this.router.patch('/reset/password',UserValidators.resetPassword(),GlobalMiddleware.checkError,UserController.resetPassword);
        // 9 Route to update profile picture
        this.router.patch('/update/profilePic',GlobalMiddleware.authenticate, new Utils().multer.single('profile_pic'),UserValidators.updateProfilePic(),GlobalMiddleware.checkError, UserController.updateProilePic)
    }

    deleteRoutes(){

    }
}

export default new UserRouter().router;