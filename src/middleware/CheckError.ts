import { validationResult } from 'express-validator';
import * as Jwt from 'jsonwebtoken'
import { getEnvironmentVariables } from '../environments/env';



export class GlobalMiddleware{


      // validationResult is used to catch all the errors from the UserValidators file
    static checkError(req,res,next){
        const error = validationResult(req);
        if(!error.isEmpty()){
            next(new Error(error.array()[0].msg));
        }else{
            next();
        }
    }

    static async authenticate(req,res,next){
        const authHeader = req.headers.authorization;
        //Getting the token send by the user
        const token = authHeader ? authHeader.slice(7 , authHeader.length) : null;
        try {
            Jwt.verify(token, getEnvironmentVariables().jwt_secret, (err, decoded)=>{
                if(err)
                {
                    next(err);
                }else if(!decoded){
                    req.errorStatus = 401; //Unauthorised error => 401
                    next(new Error('User not authorised'))
                }
                else{
                    req.user = decoded;
                //res.send(decoded);
                next();
                }
            })         
        } catch (error) {
            req.errorStatus = 401; //Unauthorised error => 401
            next(error);        
        }
    }
}