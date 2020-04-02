import User from "../models/User";
import {validationResult} from 'express-validator'

export class UserController {

    //SIGN Up
    static signUp(req,res,next){

    //validationResult is used to catch all the errors from the UserValidators file
     const error = validationResult(req);
     const username = req.body.username;
     const password = req.body.password;
     const email = req.body.email;
     if(!error.isEmpty()){
         next(new Error(error.array()[0].msg));
         return;
     }
     const data = {email,username,password}
     const user = new User(data);
     user.save().then((user)=>{
         res.send(user);
     }).catch((err)=>{
         next(err)
     })
}


}