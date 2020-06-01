import { query } from 'express-validator';
import { NodeMailer } from './../utils/NodeMailer';
import { Utils } from './../utils/Utils';
import User from "../models/User";
import * as Jwt from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/env';

export class UserController {

    // 1 SIGN UP
    static async  signUp(req,res,next){
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const verficationToken = Utils.generateVerificationToken();

    try {

     const hash = await Utils.encryptPassword(password);
     const data = {email:email,
                    username:username,
                    password:hash,
                    verification_token: verficationToken,
                    verification_token_time : Date.now() + new Utils().MAX_TOKEN_TIME,
                    ceated_at: new Date(),
                    updated_at: new Date() 
                };
                let user = await new User(data).save();
                res.send(user)
                //send verification email
                await NodeMailer.sendEmail({to:['naman.mitian@gmail.com'],
                subject:'Email Verification',
                html:`<h1>${verficationToken}</h1>`})
           
    } catch (error) {
        next(error)
    }

}


// 2 Function to verify User by email
static async verify(req,res,next){

    //Getting verification token and email by body form
    const verificationToken = req.body.verification_token;
    const email = req.body.email;
    
    try {
      const user = await  User.findOneAndUpdate({email:email, verification_token: verificationToken, 
                     verification_token_time: {$gt: Date.now()}},{verified: true},{new: true})
                    if(user)
                    {
                        res.send(user);
                    }else{
                        throw new Error('Verification token has expired. Please request for a new token')
                    }
    } catch (error) {
        next(error)
    }
}


    // 3 Function to send verification token again if the previous token has expired
    static async resendVerficationEmail (req,res,next){

        //Resending verification token only requires email in query
        const email = req.user.email;
        const verficationToken = Utils.generateVerificationToken();
        try {
           const user : any = await User.findOneAndUpdate({email:email},
                {verification_token: verficationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME },{new:true});
            
                if(user){
                 const mailer = await   NodeMailer.sendEmail({to:[user.email],subject:'Email Verification',html:`${verficationToken}`})
                 res.json({
                     success : true
                 })
                }else{
                    throw new Error('User does not exist')
                }

        } catch (error) {
            next(error);
        }
    }


    //Function to do perform login
    static async login(req,res,next){
        const password = req.query.password;
        // req.user has been set while validation of the login 
        const user = req.user;
        try {
            //Comparing the password send by the user to the password sotred in the database
            await Utils.comparePassword({plainPassword:password,encryptedPassword:user.password});
            //if the code runs after the above line then the password is correct and user has successfully loged in
            const token = Jwt.sign({email:user.email,user_id:user._id},getEnvironmentVariables().jwt_secret,{expiresIn:'120d'})
            res.send({token:token,user:user})
        } catch (error) {
            next(error);
        }
    }

    //Function to update password
    static async updatePassword(req,res,next){
        const user_id = req.user.user_id;
        const password = req.body.password;
        const newPassword = req.body.new_password;
        try {
           const user : any = await User.findOne({_id:user_id});
           await Utils.comparePassword({plainPassword:password,encryptedPassword:user.password});
           const encryptedPassword = await Utils.encryptPassword(newPassword);
           const newUser = await User.findOneAndUpdate({_id:user_id},{password:encryptedPassword},{new:true});
           res.send(newUser);
        } catch (error) {
            next(error);
        }
    }

    //Function to reset password token of the send email (to reset password if user forgets password)
    static async sendResetPasswordEmail(req,res,next){
        const email = req.query.email;
        const resetPasswordToken = Utils.generateVerificationToken(); //Generating the token to send to the mail
        try {
            const updatedUser = await User.findOneAndUpdate({email:email},
                {
                    updated_at:new Date(),
                    reset_password_token:resetPasswordToken,
                    reset_password_token_time:Date.now() + new Utils().MAX_TOKEN_TIME
                },{new:true})
            res.send(updatedUser);

            await NodeMailer.sendEmail(
                {to:[email],
                    subject:'Reset Password Email',
                    html:`<h1>${resetPasswordToken}</h1>` 
                })            
        } catch (error) {
            next(error)
        }
    }

//After the reset password token has been verified     
    static verifyResetPasswordToken(req,res,next){
        res.json({
            success:true
        })
    }

//Function to reset the password
static async resetPassword(req,res,next){
    const user = req.user;
    const newPassword = req.body.new_password;
    try {
        const encryptedPassword = await Utils.encryptPassword(newPassword);
        const updatedUser = await User.findOneAndUpdate({_id:user._id},{updated_at:new Date(),
        password:encryptedPassword},{new:true});
        res.send(updatedUser);
    } catch (error) {
        next(error);
    }
}

//Update profile pic
static async updateProilePic(req, res, next){
    const userId = req.user.user_id;
    const fileUrl = 'http://localhost:8000/' + req.file.path;
    try {
        const user = await User.findOneAndUpdate({_id : userId},{updated_at: new Date(),
            profile_pic_url : fileUrl},{new:true});

            res.send(user);
    } catch (error) {
        next(error);
    }
}
}