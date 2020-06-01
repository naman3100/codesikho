import {body} from 'express-validator';

export class PostValidators {

    static addPost(){
        return [body('content','Post Content is required').isString()];
    }
    
}