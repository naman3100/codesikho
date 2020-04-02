import { body } from 'express-validator'
import User from '../src/models/User'

export class UserValidators {
   static signUp(){
       return [
           body('email','Email is required').isEmail().custom((email,{req})=>{
               console.log(req.body)
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
}