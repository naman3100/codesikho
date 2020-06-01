import { body, query } from 'express-validator'
import User from '../models/User'

export class UserValidators {
   //These are the validatores to make sure that user has send adequate information with the route
   static signUp(){
       return [
           body('email','Email is required').isEmail().custom((email,{req})=>{
             return  User.findOne({email:email}).then((user)=>{
                   if(user){
                       throw new Error('User already exists')
                   }
                   else{
                       return true;
                   }
               })
           }),
           body('password','Password is required').isAlphanumeric().isLength({min:8,max:20}).withMessage('Password can be between 8 to 20 characters only'),
           body('username','Username is required').isString()
       ]
   }

   static verifyUser(){
       return [body('verification_token','Verification token is required').isNumeric(),
                body('email','Email is required').isEmail()
    ]
   }

   static resendVerificationEmail(){
       return [query('email','Email is required for resending verification').isEmail()]
   }

   static login(){
       return [query('email','Email is required for login').isEmail()
        .custom((email,{req})=>{
         return  User.findOne({email:email}).then(user=>{
               if(user){
                   //Here if the user exists in the data base then it is send to the req 
                   req.user = user;
                   return true;
               }else{
                   throw new Error('user does not esist');
               }
           })
       }),
                query('password','Password is required for login').isAlphanumeric()]
   }


   //function to check the update password credintials
   static updatePassword(){
       return [body('password','Password is required').isAlphanumeric(),
                body('confirm_password','Confirm Password is required').isAlphanumeric(),
                body('new_password','New Password is required').isAlphanumeric()
                .custom((new_password,{req})=>{
                    if(new_password == req.body.confirm_password){
                        return true;
                    }else{
                        req.errorStatus = 422;
                        throw new Error('Password and Confirm Password do not match');
                    }
                })
    ]
   }

   static sendResetPasswordEmail(){
    return [query('email','Email is required to reset password').isEmail().custom((email,{req})=>{
        return User.findOne({email:email}).then((user)=>{
            if(user){
                return true;
            }else{
                throw new Error('Email/User does not exist')
            }
        })
    })]
}

//To verify the token send by the user to reset the password
static verifyResetPasswordToken(){
    return [query('reset_password_token','Reset Password Token is Required').isNumeric().custom((token,{req})=>{
        return User.findOne({reset_password_token:token, 
            reset_password_token_time: {$gt: Date.now()}})
            .then((user)=>{
                if(user){
                    return true;
                }else{
                    throw new Error('Token does not exist, Please request a new token');
                }
            })
    })]
}

//Function to reset password after reset_password_token validation
static resetPassword(){
    return [body('email','Email is required').isEmail().custom((email,{req})=>{
       return User.findOne({email:email}).then((user)=>{
           if(user){
               req.user=user;
               return true;
           }else{
               throw new Error('User Does not exist');
           }
       })
    }),
    body('confirm_password','Confirm Password is required').isAlphanumeric() ,
    body('new_password','New Password is required').isAlphanumeric().custom((newPassword,{req})=>{
        if(newPassword === req.body.confirm_password){
            return true;
        }else{
            throw new Error('Confirm Password and new password do not match')
        }
    }),  
    body('reset_password_token','Reset Password token is required').isNumeric().custom((token,{req})=>{
        if(Number(req.user.reset_password_token) === Number(token)){
            return true;
        }else{
            req.errorStatus = 422;
            throw new Error('Reset Password token is invalid. Please try again');
        }
    })
]
}

//Function to test update profile pic
static updateProfilePic(){
    return [body('profile_pic').custom((profilePic,{req})=>{
        if(req.file){
            return true;
        }else{
            throw new Error('File not uploaded');
        }
    })]
}

}